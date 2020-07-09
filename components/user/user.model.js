const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const validator = require('validator');
const phone = require('phone');

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailConfirmationToken: { type: String, default: uuidv4() },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpiration: Date,
    active: { type: Boolean, default: false, required: true }
  },
  { timestamps: true }
);

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
      this.invalidate('password', 'must be between 6 and 12 characters.');
    }
    if (this._password !== this._confirmation) {
      this.invalidate('confirmation', 'must match confirmation.');
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'required');
  }
}, null);

userSchema.pre('save', function (next) {
  const result = phone(this.phone, 'ARG', true);
  console.log('PHONE NORMALIZED!!!', result[0]);
  this.phone = result[0];
  next();
});

module.exports = mongoose.model('User', userSchema);
