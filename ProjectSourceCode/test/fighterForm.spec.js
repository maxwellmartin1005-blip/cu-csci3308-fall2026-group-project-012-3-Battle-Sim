const {readFile, unlink, readdir} = require('node:fs/promises');
const path = require('node:path');
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

describe('Fighter creation form and saving', () => {
  const username = 'fighter_form_' + randomUUID();
  const fighterName = 'Preview ' + randomUUID();
  const password = 'FighterPreview123!';
  const moveIds = [];
  let templateId;
  const templateStats = {health: 475, attack: 300, defense: 250, alteration: 300, permanence: 325, agility: 350};
  let agent;
  let filesBeforeTest;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Fighter tests require an isolated test database');
    }
    image = await sharp({create: {width: 8, height: 8, channels: 3, background: '#4488aa'}}).png().toBuffer();
    jpegImage = await sharp(image).jpeg().toBuffer();
    await db.none('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, username + '@example.test', await bcrypt.hash(password, 10)]);
    for (let index = 0; index < 5; index++) {
      const move = await db.one("INSERT INTO moves (name, type, element) VALUES ($1, 'quick', 'fire') RETURNING id",
        ['Test move ' + username + ' ' + index]);
      moveIds.push(move.id);
    }
    const template = await db.one(
      `INSERT INTO fighters (creator_id, name, element, health, attack, defense, alteration, permanence, agility)
       VALUES (0, $1, 'fire', $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['Class ' + username, ...Object.values(templateStats)]
    );
    templateId = template.id;
    for (const id of moveIds.slice(0, 4)) {
      await db.none('INSERT INTO moves_to_fighters (fighter_id, move_id) VALUES ($1, $2)', [templateId, id]);
    }
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test' && process.env.POSTGRES_DB?.endsWith('_test')) {
      await db.none('DELETE FROM moves_to_fighters WHERE fighter_id = $1', [templateId]);
      await db.none('DELETE FROM fighters WHERE id = $1', [templateId]);
      await db.none('DELETE FROM moves WHERE id = ANY($1::int[])', [moveIds]);
      await db.none('DELETE FROM users WHERE username = $1', [username]);
    }
  });

  beforeEach(async () => {
    filesBeforeTest = await readdir(path.join(__dirname, '../images'));
    agent = chai.request.agent(app);
    const login = await agent.post('/login').type('form').send({username, password}).redirects(0);
    expect(login).to.have.status(302);
  });
  afterEach(async () => {
    await agent.close();
    const rows = await db.any('SELECT id, image FROM fighters WHERE name = $1', [fighterName]);
    for (const row of rows) {
      await unlink(path.join(__dirname, '..', row.image));
    }
    const ids = rows.map(row => row.id);
    await db.none('DELETE FROM moves_to_fighters WHERE fighter_id = ANY($1::int[])', [ids]);
    await db.none('DELETE FROM users_to_fighters WHERE fighter_id = ANY($1::int[])', [ids]);
    await db.none('DELETE FROM fighters WHERE id = ANY($1::int[])', [ids]);
    expect(await readdir(path.join(__dirname, '../images'))).to.deep.equal(filesBeforeTest);
  });

  async function expectNoFighterSaved() {
    const rows = await db.any('SELECT id FROM fighters WHERE name = $1', [fighterName]);
    expect(rows).to.have.lengthOf(0);
  }

  function submit(overrides = {}, data = image, imageType = 'image/png') {
    const fields = {fighterName, templateId: String(templateId), element: 'fire', moves: moveIds.slice(0, 4).map(String), ...overrides};
    let request = agent.post('/createFighter').redirects(0);
    for (const [name, value] of Object.entries(fields)) {
      request = request.field(name, value);
    }
    if (data) {
      request = request.attach('fighterImage', data, {filename: imageType === 'image/jpeg' ? 'fighter.jpg' : 'fighter.png', contentType: imageType});
    }
    return request;
  }

  it('renders real move IDs, elements, and the Save Fighter button', async () => {
    const res = await agent.get('/createFighter');
    expect(res).to.have.status(200);
    expect(res.text).to.include('value="' + moveIds[0] + '"');
    expect(res.text).to.include('Test move ' + username);
    expect(res.text).to.include('name="templateId"');
    expect(res.text).to.include('data-moves="' + moveIds.slice(0, 4).join(',') + '"');
    expect(res.text).to.include('Save Fighter');
    expect(res.text).not.to.include('value="quickHit"');
  });

  it('saves exactly one fighter, its image, owner, selected class stats and four moves through HTTP', async () => {
    const res = await submit();
    expect(res).to.have.status(302);
    expect(res.headers.location).to.match(/^\/createFighter\?saved=\d+$/);
    const rows = await db.any('SELECT * FROM fighters WHERE name = $1', [fighterName]);
    expect(rows).to.have.lengthOf(1);
    const fighter = rows[0];
    const user = await db.one('SELECT id FROM users WHERE username = $1', [username]);
    expect(fighter.creator_id).to.equal(user.id);
    expect(fighter.element).to.equal('fire');
    expect(fighter.image).to.match(/^\/images\/[0-9a-f-]{36}\.png$/);
    expect(await readFile(path.join(__dirname, '..', fighter.image))).to.deep.equal(image);
    const served = await agent.get(fighter.image);
    expect(served).to.have.status(200);
    expect(served).to.have.header('content-type', 'image/png');
    expect(served.body).to.deep.equal(image);
    for (const [name, value] of Object.entries(templateStats)) {
      expect(fighter[name]).to.equal(value);
    }
    const owners = await db.any('SELECT user_id FROM users_to_fighters WHERE fighter_id = $1', [fighter.id]);
    expect(owners).to.deep.equal([{user_id: user.id}]);
    const moves = await db.map('SELECT move_id FROM moves_to_fighters WHERE fighter_id = $1 ORDER BY move_id',
      [fighter.id], row => row.move_id);
    expect(moves).to.deep.equal(moveIds.slice(0, 4));

    const confirmation = await agent.get(res.headers.location);
    expect(confirmation).to.have.status(200);
    expect(confirmation.text).to.include('Fighter saved: ' + fighterName);
    expect(confirmation.text).to.include('href="/characterSelect"');
    await agent.get(res.headers.location);
    const afterRefresh = await db.any('SELECT id FROM fighters WHERE name = $1', [fighterName]);
    expect(afterRefresh).to.have.lengthOf(1);
  });

  it('ignores form owner/stat values and uses the selected class element', async () => {
    const res = await submit({creator_id: '0', user_id: '0', health: '999999', attack: '999999', element: 'water'});
    expect(res).to.have.status(302);
    const fighter = await db.one('SELECT creator_id, health, attack, element FROM fighters WHERE name = $1', [fighterName]);
    const user = await db.one('SELECT id FROM users WHERE username = $1', [username]);
    const baseline = templateStats;
    expect(fighter.creator_id).to.equal(user.id);
    expect(fighter.health).to.equal(baseline.health);
    expect(fighter.attack).to.equal(baseline.attack);
    expect(fighter.element).to.equal('fire');
  });

  it('shows confirmation only for a fighter owned by the signed-in user', async () => {
    const starter = await db.one('SELECT id FROM fighters WHERE creator_id = 0 ORDER BY id LIMIT 1');
    for (const id of [String(starter.id), 'not-a-number', '999999999999999999999999']) {
      const res = await agent.get('/createFighter?saved=' + id);
      expect(res).to.have.status(200);
      expect(res.text).not.to.include('Fighter saved:');
    }
  });

  for (const testCase of [
    {name: 'a blank name', input: {fighterName: '   '}, message: 'Enter a fighter name'},
    {name: 'a name longer than 255 characters', input: {fighterName: 'x'.repeat(256)}, message: 'Enter a fighter name'},
    {name: 'an invalid class', input: {templateId: '999999999'}, message: 'Choose an available class.'},
    {name: 'no selected moves', input: {moves: ''}, message: 'Choose exactly four different available moves.'},
  ]) {
    it('rejects ' + testCase.name, async () => {
      const res = await submit(testCase.input);
      expect(res).to.have.status(400);
      await expectNoFighterSaved();
      expect(res.text).to.include(testCase.message);
    });
  }

  it('rejects a missing image', async () => {
    const res = await submit({}, null);
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('Choose a PNG or JPEG image.');
    expect(res.text).to.include(fighterName);
  });

  it('rejects a text file pretending to be a PNG', async () => {
    const res = await submit({}, Buffer.from('not an image'));
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('Use a readable PNG or JPEG image file.');
  });

  it('accepts a readable JPEG as well as a PNG', async () => {
    const res = await submit({}, jpegImage, 'image/jpeg');
    expect(res).to.have.status(302);
    const saved = await db.one('SELECT image FROM fighters WHERE name = $1', [fighterName]);
    expect(saved.image).to.match(/^\/images\/[0-9a-f-]{36}\.jpg$/);
    expect(await readFile(path.join(__dirname, '..', saved.image))).to.deep.equal(jpegImage);
  });

  for (const format of ['png', 'jpeg']) {
    it('rejects a ' + format + ' signature with no image data', async () => {
      const header = format === 'png'
        ? Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
        : Buffer.from([255, 216, 255]);
      const res = await submit({}, header, 'image/' + format);
      expect(res).to.have.status(400);
      await expectNoFighterSaved();
      expect(res.text).to.include('Use a readable PNG or JPEG image file.');
    });

    it('rejects truncated ' + format + ' pixel data', async () => {
      const fullImage = format === 'png' ? image : jpegImage;
      const removedBytes = format === 'png' ? 20 : 2;
      const truncated = fullImage.subarray(0, fullImage.length - removedBytes);
      await sharp(truncated).metadata();
      const res = await submit({}, truncated, 'image/' + format);
      expect(res).to.have.status(400);
      await expectNoFighterSaved();
    });
  }

  it('rejects a MIME type that does not match the image', async () => {
    const res = await submit({}, image, 'image/jpeg');
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
  });

  it('preserves the name, element and selected move after an image error', async () => {
    const res = await submit({element: 'water'}, Buffer.from('not an image'));
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('value="' + fighterName + '"');
    expect(res.text).to.include('value="' + templateId + '" selected');
    expect(res.text).to.include('name="element" value="fire" readonly');
    for (const id of moveIds.slice(0, 4)) {
      expect(res.text).to.include('value="' + id + '" checked');
    }
  });

  for (const count of [1, 2, 3, 5]) {
    it('rejects ' + count + ' selected moves', async () => {
      const res = await submit({moves: moveIds.slice(0, count).map(String)});
      expect(res).to.have.status(400);
      await expectNoFighterSaved();
      expect(res.text).to.include('Choose exactly four different available moves.');
    });
  }

  it('rejects four IDs containing an unavailable move', async () => {
    const moves = [...moveIds.slice(0, 3).map(String), '999999999'];
    const res = await submit({moves});
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('Choose exactly four different available moves.');
  });

  it('rejects repeated move IDs', async () => {
    const res = await submit({moves: Array(4).fill(String(moveIds[0]))});
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('Choose exactly four different available moves.');
  });

  it('rejects images larger than 2 MB', async () => {
    const res = await submit({}, Buffer.alloc(2 * 1024 * 1024 + 1));
    expect(res).to.have.status(400);
    await expectNoFighterSaved();
    expect(res.text).to.include('Choose an image no larger than 2 MB.');
  });

  it('shows a useful error and rolls back when the database rejects a move insert', async () => {
    const counts = `SELECT (SELECT count(*)::int FROM fighters) AS fighters,
      (SELECT count(*)::int FROM users_to_fighters) AS owners,
      (SELECT count(*)::int FROM moves_to_fighters) AS moves`;
    const before = await db.one(counts);
    const filesBefore = await readdir(path.join(__dirname, '../images'));
    const name = 'fail_http_' + randomUUID().replaceAll('-', '');
    await db.none(`CREATE FUNCTION ${name}() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'forced HTTP save failure'; END;
    $$`);
    try {
      await db.none(`CREATE TRIGGER ${name} BEFORE INSERT ON moves_to_fighters
        FOR EACH ROW WHEN (NEW.move_id = ${moveIds[3]}) EXECUTE FUNCTION ${name}()`);
      const res = await submit();
      expect(res).to.have.status(500);
      expect(res.text).to.include('Could not save your fighter. Please try again.');
      expect(res.text).not.to.include('forced HTTP save failure');
      expect(res.text).to.include(fighterName);
      expect(await db.one(counts)).to.deep.equal(before);
      expect(await readdir(path.join(__dirname, '../images'))).to.deep.equal(filesBefore);
    } finally {
      await db.none(`DROP TRIGGER IF EXISTS ${name} ON moves_to_fighters`);
      await db.none(`DROP FUNCTION ${name}()`);
    }
  });

  it('requires login to view or submit the form', async () => {
    for (const method of ['get', 'post']) {
      const res = await chai.request(app)[method]('/createFighter').redirects(0);
      expect(res).to.have.status(302);
      expect(res).to.have.header('location', '/login');
    }
  });
});
