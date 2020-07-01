const Order = require('./order.model');

async function create(data) {
  const order = new Order(data);
  return order.save();
}

async function get(orderId) {
  return Order.findById(orderId);
}

async function update(orderId, data) {
  return Order.findByIdAndUpdate(orderId, data, { new: true });
}

async function remove(orderId) {
  return Order.findByIdAndDelete(orderId);
}

module.exports = {
  create,
  get,
  update,
  remove
};
