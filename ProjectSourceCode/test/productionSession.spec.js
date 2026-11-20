const chai = require('chai');
const chaiHttp = require('chai-http');
const {randomUUID} = require('node:crypto');
const bcrypt = require('bcryptjs');
const {db} = require('./db');

chai.use(chaiHttp);
const {expect} = chai;

describe('Production sessions behind an HTTPS proxy', () => {
  const username = 'proxy_' + randomUUID();
  const password = 'ProxyTestPassword123!';
  let app;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Proxy tests require an isolated _test database and NODE_ENV=test');
    }
    const appPath = require.resolve('../app');
    const cachedApp = require.cache[appPath];
    try {
      delete require.cache[appPath];
      process.env.NODE_ENV = 'production';
      app = require('../app');
    } finally {
      process.env.NODE_ENV = 'test';
      if (cachedApp) require.cache[appPath] = cachedApp;
      else delete require.cache[appPath];
    }
    await db.none('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, username + '@example.test', await bcrypt.hash(password, 10)]);
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test' && process.env.POSTGRES_DB?.endsWith('_test')) {
      await db.none('DELETE FROM users WHERE username = $1', [username]);
    }
  });

  function login() {
    return chai.request(app).post('/login').set('X-Forwarded-Proto', 'https')
      .type('form').send({username, password}).redirects(0);
  }

  it('sets a secure cookie and keeps the player signed in across protected requests', async () => {
    const res = await login();
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/home');
    expect(res.headers['set-cookie']).to.be.an('array');
    const cookie = res.headers['set-cookie'].find(value => value.startsWith('battle.sid='));
    expect(cookie).to.include('; Secure');
    expect(cookie).to.include('; HttpOnly');
    expect(cookie).to.include('; SameSite=Lax');
    // Replay the cookie explicitly: the test transport itself uses HTTP.
    const sessionCookie = cookie.split(';')[0];
    for (const route of ['/home', '/home', '/characterSelect']) {
      const page = await chai.request(app).get(route).set('X-Forwarded-Proto', 'https')
        .set('Cookie', sessionCookie).redirects(0);
      expect(page).to.have.status(200);
      if (route === '/home') expect(page.text).to.include('Welcome, ' + username + '!');
    }
  });

  it('does not issue a production session cookie over plain HTTP', async () => {
    const res = await chai.request(app).post('/login').type('form')
      .send({username, password}).redirects(0);
    expect(res).to.have.status(302);
    expect(res).not.to.have.header('set-cookie');
  });

  it('rejects incorrect credentials and signed-out access through the proxy', async () => {
    const res = await chai.request(app).post('/login').set('X-Forwarded-Proto', 'https')
      .type('form').send({username, password: 'IncorrectPassword!'}).redirects(0);
    expect(res).to.have.status(401);
    expect(res).not.to.have.header('set-cookie');
    const home = await chai.request(app).get('/home').set('X-Forwarded-Proto', 'https').redirects(0);
    expect(home).to.have.header('location', '/login');
  });

  it('destroys the proxied session on logout and rejects cookie reuse', async () => {
    const res = await login();
    expect(res.headers['set-cookie']).to.be.an('array');
    const cookie = res.headers['set-cookie'][0].split(';')[0];
    const logout = await chai.request(app).post('/logout').set('X-Forwarded-Proto', 'https')
      .set('Cookie', cookie).redirects(0);
    expect(logout).to.have.header('location', '/login');
    expect(logout.headers['set-cookie'].join(';')).to.include('battle.sid=;');
    const home = await chai.request(app).get('/home').set('X-Forwarded-Proto', 'https')
      .set('Cookie', cookie).redirects(0);
    expect(home).to.have.header('location', '/login');
  });
});
