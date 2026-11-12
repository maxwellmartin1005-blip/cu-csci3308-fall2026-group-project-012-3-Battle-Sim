const chai = require('chai');
const chaiHttp = require('chai-http');
const {randomUUID} = require('node:crypto');
const bcrypt = require('bcryptjs');
const {db} = require('./db');
const app = require('../app');

chai.use(chaiHttp);
const {expect} = chai;

describe('Login sessions and logout', () => {
  const username = 'session_' + randomUUID();
  const password = 'SessionTestPassword123!';
  let agent;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Session tests require an isolated _test database and NODE_ENV=test');
    }
    await db.none('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, username + '@example.test', await bcrypt.hash(password, 10)]);
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test' && process.env.POSTGRES_DB?.endsWith('_test')) {
      await db.none('DELETE FROM users WHERE username = $1', [username]);
    }
  });

  beforeEach(() => { agent = chai.request.agent(app); });
  afterEach(async () => { await agent.close(); });

  async function login() {
    return agent.post('/login').type('form').send({username, password}).redirects(0);
  }

  it('redirects a signed-out visitor from Home to Login', async () => {
    const res = await agent.get('/home').redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');
  });

  it('keeps a real database user signed in and renders their username', async () => {
    const res = await login();
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/home');
    const cookie = res.headers['set-cookie'].find(value => value.startsWith('battle.sid='));
    expect(cookie).to.include('HttpOnly');
    expect(cookie).to.include('SameSite=Lax');
    expect(cookie).not.to.include(password);
    const home = await agent.get('/home');
    expect(home).to.have.status(200);
    expect(home.text).to.include('Welcome, ' + username + '!');
    expect(home.text).to.include('action="/logout" method="POST"');
    expect(home.text).not.to.include('Sample player.');
    expect(home).to.have.header('cache-control', 'no-store');
  });

  it('does not establish a session after incorrect credentials', async () => {
    const res = await agent.post('/login').type('form')
      .send({username, password: 'IncorrectPassword!'}).redirects(0);
    expect(res).to.have.status(401);
    expect(res).not.to.have.header('set-cookie');
    const home = await agent.get('/home').redirects(0);
    expect(home).to.have.header('location', '/login');
  });

  it('does not establish a session after missing credentials', async () => {
    const res = await agent.post('/login').send({username}).redirects(0);
    expect(res).to.have.status(400);
    const home = await agent.get('/home').redirects(0);
    expect(home).to.have.header('location', '/login');
  });

  it('regenerates the session ID and invalidates the previous ID on login', async () => {
    const first = await login();
    const oldCookie = first.headers['set-cookie'][0].split(';')[0];
    const second = await login();
    const newCookie = second.headers['set-cookie'][0].split(';')[0];
    expect(newCookie).not.to.equal(oldCookie);
    const oldSession = await chai.request(app).get('/home').set('Cookie', oldCookie).redirects(0);
    expect(oldSession).to.have.header('location', '/login');
    const home = await agent.get('/home');
    expect(home).to.have.status(200);
  });

  it('destroys the session, clears its cookie, and rejects reuse after logout', async () => {
    const signedIn = await login();
    const oldCookie = signedIn.headers['set-cookie'][0].split(';')[0];
    const res = await agent.post('/logout').redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');
    expect(res.headers['set-cookie'].join(';')).to.include('battle.sid=;');
    expect(res.headers['set-cookie'].join(';')).to.include('Expires=Thu, 01 Jan 1970');
    const home = await agent.get('/home').redirects(0);
    expect(home).to.have.header('location', '/login');
    const replay = await chai.request(app).get('/home').set('Cookie', oldCookie).redirects(0);
    expect(replay).to.have.header('location', '/login');
  });

  it('allows a signed-out user to log out safely', async () => {
    const res = await agent.post('/logout').redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');
  });
});
