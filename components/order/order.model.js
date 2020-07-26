const mongoose = require('mongoose');
const { Person } = require('../user/user.model');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    state: { type: String, required: true },
    items: [
      {
        _id: false,
        quantity: Number,
        pizza: { type: Schema.Types.ObjectId, required: true, ref: 'Pizza' }
      }
    ],
    customer: { type: Person.schema, required: true, _id: false },
    totalItems: Number,
    totalAmount: Number,
    deliveryDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
