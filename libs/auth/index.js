const basicAuth = require('basic-auth');
const Error = require('@hapi/boom');

const User = require('../../components/user/user.model');
const dbService = require('../db/db.service');
const types = dbService.types;

async function checkCredentials(req, res, next) {
  const cred = basicAuth(req);

  if (
    !cred ||
    !cred.name ||
    !cred.pass ||
    cred.name === 'undefined' ||
    cred.pass === 'undefined'
  ) {
    return next(
      Error.forbidden('invalid credentials', {
        msg: 'auth_access_forbidden'
      })
    );
  }

  const { name: userId, pass: token } = cred;

  if (!types.ObjectId.isValid(userId)) {
    return next(
      Error.unauthorized('invalid_apikey', {
        msg: 'auth_invalid_apikey'
      })
    );
  }

  try {
    const user = await findUserByApiKey(userId, token);
    if (!user) {
      return next(
        Error.unauthorized('perm_denied', { msg: 'auth_perm_denied' })
      );
    }

    if (user.token !== token) {
      return next(
        Error.unauthorized('perm_denied', { msg: 'auth_perm_denied' })
      );
    }

    req.user = user;
  } catch (e) {
    return next(
      Error.badImplementation(e.message, { msg: 'auth_unknown_err' })
    );
  }

  return next();
}

async function findUserByApiKey(_id, token) {
  return User.findOne({ _id, token });
}

module.exports = {
  checkCredentials
};
