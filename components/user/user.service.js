const User = require('./user.model');

async function create(data) {
  const user = new User(data);
  return user.save();
}

async function get(userId) {
  return User.findById(userId, { pass: 0, token: 0, apikey: 0 });
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
  get,
  update,
  remove
};
