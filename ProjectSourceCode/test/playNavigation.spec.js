const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const {randomUUID} = require('node:crypto');
const {db} = require('./db');
const app = require('../app');

chai.use(chaiHttp);
const {expect} = chai;

describe('Home Play navigation', () => {
  const username = 'play_' + randomUUID();
  const password = 'PlayTestPassword123!';
  let agent;

  before(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.POSTGRES_DB?.endsWith('_test')) {
      throw new Error('Play tests require an isolated test database');
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
    const res = await agent.post('/login').type('form').send({username, password}).redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/home');
  }

  it('redirects signed-out selection requests to Login', async () => {
    const res = await agent.get('/characterSelect').redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');
  });

  it('renders an enabled Play button pointing to character selection', async () => {
    await login();
    const res = await agent.get('/home');
    expect(res).to.have.status(200);
    expect(res.text).to.include('action="/characterSelect" method="GET"');
    const playButton = res.text.match(/<button[^>]*>Play<\/button>/);
    expect(playButton).not.to.equal(null);
    expect(playButton[0]).not.to.include('disabled');
    expect(res.text).not.to.include('Play is a placeholder');
  });

  it('allows a signed-in user to follow Play to the selection page', async () => {
    await login();
    const home = await agent.get('/home');
    const form = home.text.match(/<form action="([^"]+)" method="GET">/);
    expect(form).not.to.equal(null);
    expect(form[1]).to.equal('/characterSelect');
    const selection = await agent.get(form[1]);
    expect(selection).to.have.status(200);
    expect(selection.text).to.include('class="character-select-body"');
  });

  it('requires login again after logging out', async () => {
    await login();
    const logout = await agent.post('/logout').redirects(0);
    expect(logout).to.have.header('location', '/login');
    const res = await agent.get('/characterSelect').redirects(0);
    expect(res).to.have.status(302);
    expect(res).to.have.header('location', '/login');
  });
});
