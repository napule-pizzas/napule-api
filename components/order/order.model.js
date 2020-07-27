const mongoose = require('mongoose');
const { personSchema } = require('../user/user.model');
const Pizza = require('../pizza/pizza.model');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    state: { type: String, required: true },
    items: [
      {
        _id: false,
        quantity: Number,
        pizza: { type: Pizza.schema, required: true, _id: false }
      }
    ],
    customer: { type: personSchema, required: true, _id: false },
    totalItems: Number,
    totalAmount: Number,
    deliveryDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
