// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars'); //to enable express to work with handlebars
const Handlebars = require('handlebars'); // to include the templating engine responsible for compiling templates
const path = require('path');
const {db} = require('./db');
const bodyParser = require('body-parser');
const {randomBytes} = require('node:crypto');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const multer = require('multer');
const {elements, maxImageSize, validateFighter} = require('./validateFighter');
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.use(express.static(path.join(__dirname)));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: 'battle.sid',
  secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get('/', (req, res) => {
  res.redirect('/login'); //this will call the /login route in the API
});

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.set('Cache-Control', 'no-store');
  return res.render('pages/home', {username: req.session.user.username});
});

app.post('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      return next(error);
    }

    res.clearCookie('battle.sid', {path: '/'});
    return res.redirect('/login');
  });
});

app.get('/register', (req, res) => {
  res.render('pages/register')
});

app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('pages/register', { message: 'Passwords do not match.', username, email });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.none(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hash]
    );
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    const message = err.code === '23505'
      ? 'That username or email is already taken.'
      : 'Something went wrong. Please try again.';
    res.render('pages/register', { message, username, email });
  }
});

app.get('/login', (req, res) => {
  res.render('pages/login')
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const hasUsername = typeof username === 'string' && username.trim().length > 0;
  const hasPassword = typeof password === 'string' && password.length > 0;

  if (!hasUsername || !hasPassword) {
    return res.status(400).render('pages/login', {
      message: 'Enter your username and password.',
      username: typeof username === 'string' ? username : '',
    });
  }

  try {
    const user = await db.oneOrNone(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );
    const passwordMatches = user && await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).render('pages/login', {
        message: 'Invalid username or password.',
        username,
      });
    }
    // Replace the old session ID before saving the signed-in user.
    return req.session.regenerate(error => {
      if (error) {
        return res.status(500).render('pages/login', {
          message: 'Unable to sign in right now. Please try again.',
          username,
        });
      }

      req.session.user = {id: user.id, username: user.username};

      // Save before redirecting so Home can read the signed-in user.
      return req.session.save(error => {
        if (error) {
          return res.status(500).render('pages/login', {
            message: 'Unable to sign in right now. Please try again.',
            username,
          });
        }

        return res.redirect('/home');
      });
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).render('pages/login', {
      message: 'Unable to sign in right now. Please try again.', username,
    });
  }
});

app.get('/characterSelect', (req,res) => {
  res.render('pages/characterSelect');
});

const fighterUpload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: maxImageSize, files: 1, fields: 100, parts: 101},
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

async function fighterForm(input = {}) {
  const moves = await db.any('SELECT id, name, element, type FROM moves ORDER BY element, name');
  const selectedMoves = Array.isArray(input.moves) ? input.moves : [input.moves];
  return {
    fighterName: typeof input.fighterName === 'string' ? input.fighterName : '',
    elements: elements.map(value => ({value, selected: input.element === value})),
    moves: moves.map(move => ({...move, checked: selectedMoves.includes(String(move.id))})),
  };
}

app.get('/createFighter', requireLogin, async (req, res, next) => {
  try {
    res.render('pages/createFighter', await fighterForm());
  } catch (error) {
    next(error);
  }
});

app.post('/createFighter', requireLogin, fighterUpload.single('fighterImage'), async (req, res, next) => {
  try {
    const form = await fighterForm(req.body);
    const errors = validateFighter(req.body, req.file, form.moves);
    if (errors.length) {
      return res.status(400).render('pages/createFighter', {...form, errors});
    }
    return res.render('pages/createFighter', {
      ...form,
      message: 'Fighter details look good. Saving is not available yet.',
    });
  } catch (error) {
    next(error);
  }
});

app.use('/createFighter', async (error, req, res, next) => {
  if (!(error instanceof multer.MulterError)) return next(error);
  try {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Choose an image no larger than 2 MB.'
      : 'Upload one image and choose from the available moves.';
    res.status(400).render('pages/createFighter', {
      ...await fighterForm(req.body), errors: [message],
    });
  } catch (databaseError) {
    next(databaseError);
  }
});

app.get('/battleResults', (req, res) => {
  // Sample outcomes for the UI preview until battle results are available.
  const outcome = req.query.outcome || 'victory';
  const isVictory = outcome === 'victory';
  res.render('pages/battleResults', {
    isVictory,
    winner: isVictory ? 'Fighter A' : 'Fighter B',
    loser: isVictory ? 'Fighter B' : 'Fighter A',
  });
});
app.get('/battle', (req, res) => {
  res.render('pages/battle')
});

module.exports = app;