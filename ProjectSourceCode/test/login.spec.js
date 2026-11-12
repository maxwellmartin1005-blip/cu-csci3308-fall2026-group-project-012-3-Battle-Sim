const chai = require('chai');
const chaiHttp = require('chai-http');
const {randomUUID} = require('node:crypto');
const bcrypt = require('bcryptjs');
const {db} = require('./db');
const app = require('../app');

chai.use(chaiHttp);
const {expect} = chai;

describe('Login credentials', () => {
  const username = 'login_' + randomUUID();
  const password = 'LoginTestPassword123!';

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Login tests require an isolated _test database and NODE_ENV=test');
    }
    await db.none('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, username + '@example.test', await bcrypt.hash(password, 10)]);
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test' && process.env.POSTGRES_DB?.endsWith('_test')) {
      await db.none('DELETE FROM users WHERE username = $1', [username]);
    }
  });

  it('accepts the password of a registered user', async () => {
    const res = await chai.request(app).post('/login').type('form')
      .send({username, password}).redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/characterSelect');
  });

  const invalidCredentials = [
    {name: 'an incorrect password', input: {username, password: 'WrongPassword!'}},
    {name: 'an unknown username', input: {username: 'missing_' + randomUUID(), password}},
    {name: 'SQL-like text as a username', input: {username: "' OR 1=1 --", password}},
  ];

  for (const testCase of invalidCredentials) {
    it('rejects ' + testCase.name, async () => {
      const res = await chai.request(app).post('/login').type('form')
        .send(testCase.input).redirects(0);
      expect(res).to.have.status(401);
      expect(res.text).to.include('Invalid username or password.');
      expect(res).not.to.have.header('location');
      expect(res.text).not.to.include(testCase.input.password);
    });
  }

  const missingOrMalformedCredentials = [
    {name: 'a missing password', input: {username}},
    {name: 'a missing username', input: {password}},
    {name: 'an empty username', input: {username: '', password}},
    {name: 'a whitespace-only username', input: {username: '   ', password}},
    {name: 'an empty password', input: {username, password: ''}},
    {name: 'a username that is not text', input: {username: [], password}},
    {name: 'a password that is not text', input: {username, password: {}}},
  ];

  for (const testCase of missingOrMalformedCredentials) {
    it('rejects ' + testCase.name, async () => {
      const res = await chai.request(app).post('/login')
        .send(testCase.input).redirects(0);
      expect(res).to.have.status(400);
      expect(res.text).to.include('Enter your username and password.');
      expect(res).not.to.have.header('location');
    });
  }

  it('renders a masked password field and preserves only the username after failure', async () => {
    const page = await chai.request(app).get('/login');
    expect(page.text).to.include('type="password"');
    const res = await chai.request(app).post('/login').type('form')
      .send({username, password: 'WrongPassword!'});
    expect(res.text).to.include('value="' + username + '"');
    expect(res.text).not.to.include('WrongPassword!');
  });
});
