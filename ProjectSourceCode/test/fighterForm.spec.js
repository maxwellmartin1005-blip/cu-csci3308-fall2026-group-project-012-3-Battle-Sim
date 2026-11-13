const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const {randomUUID} = require('node:crypto');
const {db} = require('./db');
const app = require('../app');

chai.use(chaiHttp);
const {expect} = chai;
let image;
let jpegImage;

describe('Fighter creation form preview', () => {
  const username = 'fighter_form_' + randomUUID();
  const fighterName = 'Preview ' + randomUUID();
  const password = 'FighterPreview123!';
  let moveId;
  let agent;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Fighter tests require an isolated test database');
    }
    image = await sharp({create: {width: 8, height: 8, channels: 3, background: '#4488aa'}}).png().toBuffer();
    jpegImage = await sharp(image).jpeg().toBuffer();
    await db.none('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, username + '@example.test', await bcrypt.hash(password, 10)]);
    const move = await db.one("INSERT INTO moves (name, type, element) VALUES ($1, 'quick', 'fire') RETURNING id",
      ['Test move ' + username]);
    moveId = move.id;
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test' && process.env.POSTGRES_DB?.endsWith('_test')) {
      await db.none('DELETE FROM moves WHERE id = $1', [moveId]);
      await db.none('DELETE FROM users WHERE username = $1', [username]);
    }
  });

  beforeEach(async () => {
    agent = chai.request.agent(app);
    const login = await agent.post('/login').type('form').send({username, password}).redirects(0);
    expect(login).to.have.status(302);
  });
  afterEach(async () => { await agent.close(); });

  function submit(overrides = {}, data = image, imageType = 'image/png') {
    const fields = {fighterName, element: 'fire', moves: String(moveId), ...overrides};
    let request = agent.post('/createFighter').redirects(0);
    for (const [name, value] of Object.entries(fields)) {
      request = request.field(name, value);
    }
    if (data) {
      request = request.attach('fighterImage', data, {filename: imageType === 'image/jpeg' ? 'fighter.jpg' : 'fighter.png', contentType: imageType});
    }
    return request;
  }

  it('renders real move IDs, elements, and the preview-only button', async () => {
    const res = await agent.get('/createFighter');
    expect(res).to.have.status(200);
    expect(res.text).to.include('value="' + moveId + '"');
    expect(res.text).to.include('Test move ' + username);
    expect(res.text).to.include('value="dark"');
    expect(res.text).to.include('Check fighter');
    expect(res.text).not.to.include('value="quickHit"');
  });

  it('checks valid input without creating a fighter yet', async () => {
    const res = await submit();
    expect(res).to.have.status(200);
    expect(res.text).to.include('Fighter details look good. Saving is not available yet.');
    const rows = await db.any('SELECT id FROM fighters WHERE name = $1', [fighterName]);
    expect(rows).to.have.lengthOf(0);
  });

  for (const testCase of [
    {name: 'a blank name', input: {fighterName: '   '}, message: 'Enter a fighter name'},
    {name: 'a name longer than 255 characters', input: {fighterName: 'x'.repeat(256)}, message: 'Enter a fighter name'},
    {name: 'an invalid element', input: {element: 'lava'}, message: 'Choose one of the six elements.'},
    {name: 'a nonexistent move', input: {moves: '999999999'}, message: 'Choose at least one available move.'},
    {name: 'no selected moves', input: {moves: ''}, message: 'Choose at least one available move.'},
  ]) {
    it('rejects ' + testCase.name, async () => {
      const res = await submit(testCase.input);
      expect(res).to.have.status(400);
      expect(res.text).to.include(testCase.message);
    });
  }

  it('rejects a missing image', async () => {
    const res = await submit({}, null);
    expect(res).to.have.status(400);
    expect(res.text).to.include('Choose a PNG or JPEG image.');
    expect(res.text).to.include(fighterName);
  });

  it('rejects a text file pretending to be a PNG', async () => {
    const res = await submit({}, Buffer.from('not an image'));
    expect(res).to.have.status(400);
    expect(res.text).to.include('Use a readable PNG or JPEG image file.');
  });

  it('accepts a readable JPEG as well as a PNG', async () => {
    const res = await submit({}, jpegImage, 'image/jpeg');
    expect(res).to.have.status(200);
  });

  for (const format of ['png', 'jpeg']) {
    it('rejects a ' + format + ' signature with no image data', async () => {
      const header = format === 'png'
        ? Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
        : Buffer.from([255, 216, 255]);
      const res = await submit({}, header, 'image/' + format);
      expect(res).to.have.status(400);
      expect(res.text).to.include('Use a readable PNG or JPEG image file.');
    });

    it('rejects truncated ' + format + ' pixel data', async () => {
      const fullImage = format === 'png' ? image : jpegImage;
      const removedBytes = format === 'png' ? 20 : 2;
      const truncated = fullImage.subarray(0, fullImage.length - removedBytes);
      await sharp(truncated).metadata();
      const res = await submit({}, truncated, 'image/' + format);
      expect(res).to.have.status(400);
    });
  }

  it('rejects a MIME type that does not match the image', async () => {
    const res = await submit({}, image, 'image/jpeg');
    expect(res).to.have.status(400);
  });

  it('preserves the name, element and selected move after an image error', async () => {
    const res = await submit({element: 'water'}, Buffer.from('not an image'));
    expect(res).to.have.status(400);
    expect(res.text).to.include('value="' + fighterName + '"');
    expect(res.text).to.include('value="water" selected');
    expect(res.text).to.include('value="' + moveId + '" checked');
  });

  it('rejects repeated move IDs', async () => {
    const res = await submit({moves: [String(moveId), String(moveId)]});
    expect(res).to.have.status(400);
    expect(res.text).to.include('Choose at least one available move.');
  });

  it('rejects images larger than 2 MB', async () => {
    const res = await submit({}, Buffer.alloc(2 * 1024 * 1024 + 1));
    expect(res).to.have.status(400);
    expect(res.text).to.include('Choose an image no larger than 2 MB.');
  });

  it('requires login to view or submit the form', async () => {
    for (const method of ['get', 'post']) {
      const res = await chai.request(app)[method]('/createFighter').redirects(0);
      expect(res).to.have.status(302);
      expect(res).to.have.header('location', '/login');
    }
  });
});
