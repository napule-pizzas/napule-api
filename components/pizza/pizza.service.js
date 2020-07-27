const Pizza = require('./pizza.model');

async function create(data) {
  const pizza = new Pizza(data);
  return pizza.save();
}

async function get(pizzaId) {
  return Pizza.findById(pizzaId);
}

async function update(pizzaId, data) {
  return Pizza.findByIdAndUpdate(pizzaId, data, { new: true });
}

async function remove(orderId) {
  return Pizza.findByIdAndDelete(orderId);
}

async function list() {
  return Pizza.find({});
}

module.exports = {
  create,
  get,
  update,
  remove,
  list
};
