const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    method: { type: String },
    status: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
