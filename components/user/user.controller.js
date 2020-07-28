const Error = require('@hapi/boom');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('../../libs/email');
const userService = require('./user.service');

async function create(req, res, next) {
  try {
    const data = req.body;
    let authUser = await userService.create(data);
    let token = await userService.createToken({
      _userId: authUser._id,
      token: crypto.randomBytes(16).toString('hex')
    });

    await sendConfirmationEmail(authUser.user, token);

    return res.status(201).json(authUser.user);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_create'
      })
    );
  }
}

async function get(req, res, next) {
  try {
    const _id = req.params.id;
    const authUser = await userService.get(_id);
    const { user } = authUser.toObject();
    return res.ok({ id: _id, ...user });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_read'
      })
    );
  }
}

async function getByEmail(req, res, next) {
  try {
    const email = req.query.email;
    if (email) {
      const authUser = await userService.getByEmail(email);
      if (authUser) {
        const { user } = authUser.toObject();
        return res.ok({ id: authUser._id, ...user });
      } else {
        res.ok(null);
      }
    } else {
      next();
    }
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_read'
      })
    );
  }
}

async function getInactiveByToken(req, res, next) {
  try {
    const _token = req.params.token;
    const token = await userService.getToken(_token);
    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token my have expired.'
      });
    }
    const authUser = await userService.get(token._userId);
    if (!authUser) {
      return res
        .status(400)
        .send({ msg: 'We were unable to find a user for this token.' });
    }

    if (authUser.active)
      return res.status(400).send({
        type: 'already-verified',
        msg: 'This user has already been verified.'
      });

    return res.ok(authUser.user);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_token_read'
      })
    );
  }
}

async function confirm(req, res, next) {
  try {
    const _token = req.body.token;
    const authUser = await userService.activateUser(_token);
    return res.ok(authUser.user);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_update'
      })
    );
  }
}

async function resend(req, res, next) {
  try {
    const _id = req.params.id;
    const user = await userService.get(_id);

    if (user.active)
      return res.status(400).send({
        type: 'already-verified',
        msg: 'This user has already been verified.'
      });

    let token = await userService.createToken({ _userId: user._id });

    await sendConfirmationEmail(user, token);

    return res.status(200).json({ msg: 'Confirmation email sent' });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'resend_confirmation_email'
      })
    );
  }
}

async function update(req, res, next) {
  try {
    const data = req.body;
    const _id = req.params.id;
    const authUser = await userService.update(_id, data);
    const { user } = authUser.toObject();
    return res.ok({ id: _id, ...user });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_update'
      })
    );
  }
}

async function updateAddress(req, res, next) {
  try {
    const address = req.body;
    const _id = req.params.id;
    const authUser = await userService.updateAddress(_id, address);
    const { user } = authUser.toObject();
    return res.ok({ id: _id, ...user });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_update'
      })
    );
  }
}

async function remove(req, res, next) {
  try {
    const _id = req.params.id;
    await userService.remove(_id);
    return res.ok({ user: { _id, deleted: true } });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'user_delete'
      })
    );
  }
}

// async function list(req, res, next) {
//     try {
//         const pagination = req.query;
//         const year = moment().format('YYYY');
//         const users = await User.find({ year });
//         return res.ok({ success: true, users });
//     } catch (e) {
//         return next(Error.badImplementation(e, {
//             msg: 'user_list'
//         }));
//     }
// }

module.exports = {
  validateParams: (rq, rs, nt) => nt(), // TODO: implement data validation
  create,
  get,
  getByEmail,
  getInactiveByToken,
  confirm,
  resend,
  updateAddress,
  update,
  remove
};
