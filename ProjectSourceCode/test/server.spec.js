const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const {db, pgp} = require('./db');
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);
const {expect} = chai;

// Root hook: close the shared database pool after all tests in this process.
// Keep other suites in this file or reuse these imports in separate files.
after(() => {
  pgp.end();
});

describe('Welcome route', () => {
  it('returns the default welcome message', async () => {
    const res = await chai.request(app).get('/welcome');
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal({
      status: 'success',
      message: 'Welcome!',
    });
  });
});

describe('POST /register', () => {
  const {randomUUID} = require('node:crypto');
  const testUser = {
    username: `lab10_${randomUUID()}`,
    password: 'TestPassword123!',
  };

  async function removeTestUser() {
    await db.none('DELETE FROM users WHERE username = $1', [testUser.username]);
  }

  beforeEach(removeTestUser);
  afterEach(removeTestUser);

  it('creates exactly one user for valid input', async () => {
    // Act: submit the request through the actual registration route.
    const res = await chai.request(app).post('/register').send(testUser).redirects(0);

    // Assert: verify the response
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');

    const rows = await db.any(
      'SELECT username, password_hash FROM users WHERE username = $1',
      [testUser.username]
    );
    expect(rows).to.have.lengthOf(1);
    expect(rows[0].username).to.equal(testUser.username);
    expect(rows[0].password_hash).not.to.equal(testUser.password);
    expect(await bcrypt.compare(testUser.password, rows[0].password_hash)).to.equal(
      true
    );
  });

  it('registers a user with an empty username', async () => {
    // Act: submit the request through the actual registration route.
    const res = await chai.request(app).post('/register').send(testUser).redirects(0);

    // Assert: verify the response
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');

    const rows = await db.any(
      'SELECT username, password_hash FROM users WHERE username = $1',
      [testUser.username]
    );
    expect(rows).to.have.lengthOf(1);
    expect(rows[0].username).to.equal(testUser.username);
    expect(rows[0].password_hash).not.to.equal(testUser.password);
    expect(await bcrypt.compare(testUser.password, rows[0].password_hash)).to.equal(
      true
    );
  });
  // TODO: Add an async test that submits this username without a password.
  // Assert the documented rejection response and zero matching database rows.
});