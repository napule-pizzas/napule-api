const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const tokenSchema = new Schema(
  {
    _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 86400 }
  },
  { timestamps: true }
);

const addressSchema = new Schema(
  {
    zipCode: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: Number, required: true },
    city: { type: String, required: true }
  },
  { _id: false }
);

const phoneSchema = new Schema(
  {
    areaCode: { type: Number, required: true },
    number: { type: Number, required: true }
  },
  { _id: false }
);

// eslint-disable-next-line no-useless-escape
const validateEmail = function (email) {
  return EMAIL_REGEX.test(email);
};

const userSchema = new Schema(
  {
    active: { type: Boolean, default: false },
    type: { type: String, required: true, uppercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validateEmail, 'email address invalid'],
      match: [EMAIL_REGEX, 'email address invalid']
    },
    phone: { type: phoneSchema, required: true, unique: true },
    address: { type: addressSchema, required: true },
    passwordHash: { type: String, select: false }
  },
  { timestamps: true }
);

userSchema.path('phone').validate(function (value) {
  const phone = `${value.areaCode}${value.number}`;
  const phoneNumber = parsePhoneNumberFromString(phone, 'AR');
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
