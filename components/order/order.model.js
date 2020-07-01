const mongoose = require('mongoose');
const Pizza = require('../pizza/pizza.model');
const User = require('../user/user.model');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    state: { type: String, required: true },
    items: [{ quantity: Number, pizza: Pizza }],
    customer: { type: User, required: true },
    totalItems: Number,
    deliveryDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
