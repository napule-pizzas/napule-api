const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pizzaSchema = Schema(
  {
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    price: { type: Number, required: true },
    slices: { type: Number, required: true },
    freezable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', pizzaSchema);
