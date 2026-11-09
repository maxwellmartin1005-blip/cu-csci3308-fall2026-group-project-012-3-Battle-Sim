const {expect} = require('chai');
const validateRegistration = require('../validateRegistration');

describe('Registration validation', () => {
  it('rejects a missing password', () => {
    expect(validateRegistration({username: 'student'})).to.equal(false);
  });
});