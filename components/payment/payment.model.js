const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    method: { type: String },
    status: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
