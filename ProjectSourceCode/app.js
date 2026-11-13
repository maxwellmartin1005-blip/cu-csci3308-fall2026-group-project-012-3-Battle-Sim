// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars'); //to enable express to work with handlebars
const Handlebars = require('handlebars'); // to include the templating engine responsible for compiling templates
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const getFighter = require('./props/getFighter');

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

const dbConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
const db = pgp(dbConfig);

db.connect()
  .then(obj => {
    console.log('Database connection successful');
    obj.done();
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

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

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get('/', (req, res) => {
  res.redirect('/login'); //this will call the /login route in the API
});

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
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

app.post('/login', (req, res) => {
  // TODO: Add login verification here

  res.redirect('/characterSelect');
});

app.get('/characterSelect', (req,res) => {
  res.render('pages/characterSelect');
});

app.get('/createFighter', (req, res) => {
  res.render('pages/createFighter');
});

app.post('/createFighter', (req, res) => {
  //save the fighter once the database is set up
  res.redirect('/characterSelect');
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

app.get('/battle', async(req, res) => {
  // Uncomment this line for testing purposes
  // const userFighter = await getFighter(0, db)

  res.render('pages/battle', {userFighter: userFighter})
});

module.exports = app;