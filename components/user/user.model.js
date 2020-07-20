const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const tokenSchema = new Schema(
  {
    _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 86400 }
  },
  { timestamps: true }
);

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

userSchema.path('phone').validate(function (value) {
  const phoneNumber = parsePhoneNumberFromString(value, 'AR');
  this.phone = phoneNumber.formatNational();

  return phoneNumber.isValid();
}, 'Invalid phone number');

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
