const User = require('./user.model').User;
const Token = require('./user.model').Token;

async function create(data) {
  const user = new User(data);
  return user.save();
}

async function createToken(userId) {
  const token = new Token(userId);
  return token.save();
}

async function get(userId) {
  return User.findById(userId, { pass: 0, token: 0, apikey: 0 });
}

async function getToken(token) {
  return Token.findOne({ token });
}

async function activateUser(_token) {
  const token = await Token.findOne({ token: _token });
  return User.findByIdAndUpdate(token._userId, { active: true }, { new: true });
}

async function update(userId, data) {
  return User.findByIdAndUpdate(userId, data, {
    new: true
  });
}

async function remove(userId) {
  return User.findByIdAndDelete(userId);
}

module.exports = {
  create,
  createToken,
  get,
  getToken,
  activateUser,
  update,
  remove
};
