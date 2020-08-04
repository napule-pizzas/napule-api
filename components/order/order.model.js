const mongoose = require('mongoose');
const { personSchema } = require('../user/user.model');
const Pizza = require('../pizza/pizza.model');

const { sendPrepareEmail } = require('../../libs/email');

const Schema = mongoose.Schema;

const OrderStateEnum = Object.freeze({
  SELECTING_ITEMS: 'SELECTING_ITEMS',
  SETTING_CUSTOMER_DATA: 'SETTING_CUSTOMER_DATA',
  PREPARING: 'PREPARING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_FAILURE: 'PAYMENT_FAILURE',
  DELIVERED: 'DELIVERED'
});

const orderSchema = new Schema(
  {
    state: { type: String, required: true },
    items: [
      {
        _id: false,
        quantity: Number,
        pizza: { type: Pizza.schema, required: true }
      }
    ],
    customer: { type: personSchema, required: true, _id: false },
    totalItems: Number,
    totalAmount: Number,
    deliveryDate: Date
  },
  { timestamps: true }
);

orderSchema.post('save', async function (order) {
  if (order.state === OrderStateEnum.PREPARING) {
    await sendPrepareEmail(order.toObject());
  }
});

module.exports = {
  Order: mongoose.model('Order', orderSchema),
  OrderStateEnum
};
