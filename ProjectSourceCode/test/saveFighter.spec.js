const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const {db} = require('./db');
const saveFighter = require('../saveFighter');
const {getFighterTemplates, getAllowedMoves} = require('../fighterTemplates');

describe('Saving a fighter transaction', () => {
  const username = 'save_' + randomUUID();
  const fighterName = 'Saved fighter ' + randomUUID();
  let user;
  let moveIds;
  let image;
  let startingStats;
  let template;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Saving tests require an isolated test database');
    }
    user = await db.one(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, username + '@example.test', await bcrypt.hash('SaveTestPassword123!', 10)]
    );
    template = (await getFighterTemplates())[0];
    const moves = await db.any('SELECT id FROM moves WHERE element = $1 ORDER BY id LIMIT 5', [template.element]);
    assert.equal(moves.length, 5);
    moveIds = moves.map(move => String(move.id));
    const {health, attack, defense, alteration, permanence, agility} = template;
    startingStats = {health, attack, defense, alteration, permanence, agility};
    const buffer = await sharp({create: {
      width: 8, height: 8, channels: 3, background: '#4488aa',
    }}).png().toBuffer();
    image = {buffer, size: buffer.length, mimetype: 'image/png'};
  });

  async function removeSavedFighter() {
    const ids = await db.map('SELECT id FROM fighters WHERE name = $1', [fighterName], row => row.id);
    await db.none('DELETE FROM moves_to_fighters WHERE fighter_id = ANY($1::int[])', [ids]);
    await db.none('DELETE FROM users_to_fighters WHERE fighter_id = ANY($1::int[])', [ids]);
    await db.none('DELETE FROM fighters WHERE id = ANY($1::int[])', [ids]);
  }

  afterEach(removeSavedFighter);
  after(async () => {
    if (user) await db.none('DELETE FROM users WHERE id = $1', [user.id]);
  });

  function input(overrides = {}) {
    return {fighterName, templateId: String(template.id), element: 'fire', moves: moveIds.slice(0, 4), ...overrides};
  }

  async function countSavedFighters() {
    return db.one('SELECT count(*)::int AS count FROM fighters WHERE name = $1', [fighterName]);
  }

  it('saves the selected class stats, image, owner, and exactly four move links', async () => {
    const result = await saveFighter(user, input(), image);
    const fighter = await db.one('SELECT * FROM fighters WHERE id = $1', [result.id]);
    assert.equal(fighter.name, fighterName);
    assert.equal(fighter.creator_id, user.id);
    assert.equal(fighter.element, 'fire');
    assert.deepEqual(fighter.image, image.buffer);
    for (const [name, value] of Object.entries(startingStats)) {
      assert.equal(fighter[name], value);
    }
    const owners = await db.any('SELECT user_id FROM users_to_fighters WHERE fighter_id = $1', [result.id]);
    assert.deepEqual(owners, [{user_id: user.id}]);
    const savedMoves = await db.map(
      'SELECT move_id FROM moves_to_fighters WHERE fighter_id = $1 ORDER BY move_id',
      [result.id], row => String(row.move_id)
    );
    assert.deepEqual(savedMoves, moveIds.slice(0, 4));
  });

  it('uses the session user rather than an owner supplied in the form', async () => {
    const result = await saveFighter(user, input({creator_id: 0, user_id: 0}), image);
    const saved = await db.one('SELECT creator_id FROM fighters WHERE id = $1', [result.id]);
    assert.equal(saved.creator_id, user.id);
  });

  it('rejects a missing signed-in user without inserting a fighter', async () => {
    await assert.rejects(saveFighter(null, input(), image), /Sign in/);
    assert.equal((await countSavedFighters()).count, 0);
  });

  it('requires an existing starter class instead of form-supplied stats', async () => {
    await assert.rejects(saveFighter(user, input({templateId: undefined}), image), /available class/);
    await assert.rejects(saveFighter(user, input({templateId: '999999999', health: 99999}), image), /available class/);
    assert.equal((await countSavedFighters()).count, 0);
  });

  it('does not allow a player-owned fighter as a starter class', async () => {
    const first = await saveFighter(user, input(), image);
    await assert.rejects(saveFighter(user, input({templateId: String(first.id)}), image), /available class/);
    assert.equal((await countSavedFighters()).count, 1);
  });

  it('rejects invalid fields or an unreadable image without inserting a fighter', async () => {
    await assert.rejects(saveFighter(user, input({fighterName: ''}), image), /fighter name/);
    const broken = {buffer: Buffer.from('broken'), size: 6, mimetype: 'image/png'};
    await assert.rejects(saveFighter(user, input(), broken), /readable PNG or JPEG/);
    assert.equal((await countSavedFighters()).count, 0);
  });

  for (const count of [0, 3, 5]) {
    it('rejects ' + count + ' moves before saving', async () => {
      await assert.rejects(
        saveFighter(user, input({moves: moveIds.slice(0, count)}), image),
        /exactly four/
      );
      assert.equal((await countSavedFighters()).count, 0);
    });
  }

  it('rejects duplicate and unknown moves without saving partial data', async () => {
    for (const moves of [Array(4).fill(moveIds[0]), [...moveIds.slice(0, 3), '999999999']]) {
      await assert.rejects(saveFighter(user, input({moves}), image), /exactly four/);
    }
    assert.equal((await countSavedFighters()).count, 0);
  });

  it('allows same-element moves and class defaults without duplicate choices', async () => {
    const moves = await db.any('SELECT id, element FROM moves');
    const allowed = getAllowedMoves(moves, template);
    const ids = allowed.map(move => move.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(moves.filter(move => move.element === template.element).every(move => ids.includes(move.id)));
    assert.ok(template.defaultMoves.every(id => ids.includes(id)));
  });

  it('preserves and allows a default move from another element', async () => {
    const moves = await db.any('SELECT id, element FROM moves');
    const templates = await getFighterTemplates();
    const mixed = templates.find(item => item.defaultMoves.some(id =>
      moves.find(move => move.id === id).element !== item.element));
    assert.ok(mixed);
    const result = await saveFighter(user, input({templateId: String(mixed.id), moves: mixed.defaultMoves.map(String)}), image);
    const saved = await db.one('SELECT element FROM fighters WHERE id = $1', [result.id]);
    assert.equal(saved.element, mixed.element);
    const unchanged = (await getFighterTemplates()).find(item => item.id === mixed.id);
    assert.deepEqual(unchanged.defaultMoves, mixed.defaultMoves);
  });

  it('rejects an off-element move that is not a class default', async () => {
    const moves = await db.any('SELECT id, element FROM moves');
    const forbidden = moves.find(move => move.element !== template.element && !template.defaultMoves.includes(move.id));
    const choices = [...moveIds.slice(0, 3), String(forbidden.id)];
    await assert.rejects(saveFighter(user, input({moves: choices}), image), /exactly four/);
    assert.equal((await countSavedFighters()).count, 0);
  });

  it('rolls back the fighter, ownership, and earlier moves if the final move insert fails', async () => {
    const countsQuery = `SELECT
      (SELECT count(*)::int FROM fighters) AS fighters,
      (SELECT count(*)::int FROM users_to_fighters) AS owners,
      (SELECT count(*)::int FROM moves_to_fighters) AS moves`;
    const before = await db.one(countsQuery);
    const functionName = 'fail_save_' + randomUUID().replaceAll('-', '');
    const triggerName = functionName + '_trigger';

    // Test-only trigger forces a real database failure after the other records were inserted.
    await db.none(`CREATE FUNCTION ${functionName}() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'forced final move failure'; END;
    $$`);
    try {
      await db.none(`CREATE TRIGGER ${triggerName} BEFORE INSERT ON moves_to_fighters
        FOR EACH ROW WHEN (NEW.move_id = ${Number(moveIds[3])})
        EXECUTE FUNCTION ${functionName}()`);
      await assert.rejects(saveFighter(user, input(), image), /forced final move failure/);
      assert.deepEqual(await db.one(countsQuery), before);
    } finally {
      await db.none(`DROP TRIGGER IF EXISTS ${triggerName} ON moves_to_fighters`);
      await db.none(`DROP FUNCTION ${functionName}()`);
    }
  });
});
