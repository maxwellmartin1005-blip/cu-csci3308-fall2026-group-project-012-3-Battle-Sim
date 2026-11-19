const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {db} = require('./db');
const migration = fs.readFileSync(path.join(__dirname, '../migrations/001_fighter_image_paths.sql'), 'utf8');

describe('Existing image-column migration', () => {
  async function withOldTable(test) {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Migration tests require an isolated test database');
    }
    const connection = await db.connect();
    try {
      // This connection-local table shadows fighters; application records stay untouched.
      await connection.none('CREATE TEMP TABLE fighters (creator_id int, name text, image bytea)');
      await test(connection);
    } finally {
      await connection.none('ROLLBACK');
      await connection.none('DROP TABLE IF EXISTS pg_temp.fighters');
      connection.done();
    }
  }

  it('converts the column and sets missing starter paths', () => withOldTable(async connection => {
    await connection.none('INSERT INTO fighters VALUES (0, $1, NULL)', ['The Generic One, Master of None']);
    await connection.none(migration);
    const fighter = await connection.one('SELECT image, pg_typeof(image)::text AS type FROM fighters');
    assert.deepEqual(fighter, {image: '/images/Generic.png', type: 'text'});
  }));

  it('preserves an existing path and leaves player images unset when absent', () => withOldTable(async connection => {
    await connection.none('INSERT INTO fighters VALUES (1, $1, $2), (1, $3, NULL)',
      ['Existing player', Buffer.from('/images/player.png'), 'No image']);
    await connection.none(migration);
    const fighters = await connection.any('SELECT image FROM fighters ORDER BY name');
    assert.deepEqual(fighters, [{image: '/images/player.png'}, {image: null}]);
  }));

  it('rolls back without discarding binary image data', () => withOldTable(async connection => {
    const binary = Buffer.from([137, 80, 78, 71, 0, 255]);
    await connection.none('INSERT INTO fighters VALUES (1, $1, $2)', ['Binary image', binary]);
    await assert.rejects(connection.none(migration), /UTF8|encoding|byte sequence/);
    await connection.none('ROLLBACK');
    const fighter = await connection.one('SELECT image, pg_typeof(image)::text AS type FROM fighters');
    assert.equal(fighter.type, 'bytea');
    assert.deepEqual(fighter.image, binary);
  }));
});
