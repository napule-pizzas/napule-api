const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const validator = require('validator');
const phone = require('phone');

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: { type: String, default: uuidv4() },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const userSchema = new Schema(
  {
    active: { type: Boolean, default: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },

    passwordHash: { type: String, select: false }
  },
  { timestamps: true }
);

userSchema.virtual('mobile').set(function (value) {
  const result = phone(this.phone, 'ARG', true);
  this.phone = result[0];
  if (value) {
    this.phone = [this.phone.slice(0, 3), '9', this.phone.slice(3)].join('');
  }
});

userSchema
  .virtual('password')
  .get(function () {
    return this._password;
  })
  .set(function (value) {
    this._password = value;
    var salt = bcrypt.genSaltSync(12);
    this.passwordHash = bcrypt.hashSync(value, salt);
  });

userSchema
  .virtual('confirmation')
  .get(function () {
    return this._confirmation;
  })
  .set(function (value) {
    this._confirmation = value;
  });

userSchema.path('passwordHash').validate(function () {
  if (this._password || this._confirmation) {
    if (!validator.isLength(this._password, { min: 6, max: 12 })) {
      this.invalidate('password', 'must be between 6 and 12 characters');
    }
    if (this._password !== this._confirmation) {
      this.invalidate('confirmation', 'must match password');
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'required');
  }
}, null);

const User = mongoose.model('User', userSchema);
const Token = mongoose.model('Token', tokenSchema);

module.exports = { User, Token };
