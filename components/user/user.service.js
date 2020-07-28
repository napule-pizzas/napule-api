const { User, Token } = require('./user.model');

async function create(data) {
  const user = new User(data);
  return user.save();
}

async function createToken(data) {
  const token = new Token(data);
  return token.save();
}

async function get(userId) {
  return User.findById(userId, { pass: 0, token: 0, apikey: 0 });
}

async function getByEmail(email) {
  return User.findOne({ 'user.email': email });
}

async function getToken(token) {
  return Token.findOne({ token });
}

async function activateUser(_token) {
  const token = await Token.findOne({ token: _token });
  return User.findByIdAndUpdate(token._userId, { active: true }, { new: true });
}

async function updateAddress(userId, address) {
  return User.findOneAndUpdate(
    userId,
    { 'user.address': address },
    {
      new: true
    }
  );
}

async function update(userId, data) {
  return User.findOneAndUpdate(userId, data, {
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
  getByEmail,
  getToken,
  activateUser,
  updateAddress,
  update,
  remove
};
