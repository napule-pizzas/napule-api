const Error = require('@hapi/boom');
const toObjectOptions = require('../../libs/util');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userService = require('./user.service');

async function create(req, res, next) {
  try {
    const data = req.body;
    let user = await userService.create(data);
    let token = await userService.createToken({ _userId: user._id });

    // TODO: Send emails form separate service
    const msg = {
      to: user.email,
      from: `${process.env.EMAIL_SENDER}`,
      subject: 'Confirmá Tu cuenta en napule-pizzas',
      html: `<p>Hola ${user.firstName},</p>
             <p>Porfa verificá tu cuenta haciendo click
             <a href="${process.env.UI_BASE_URL}/confirmation/${token.token}">acá</a></p>`
    };

    await sgMail.send(msg);

    user = user.toObject({ getters: true, virtuals: false, versionKey: false });
    delete user.passwordHash;

    return res.status(201).json(user);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 90,
        msg: 'user_create'
      })
    );
  }
}

async function get(req, res, next) {
  try {
    const _id = req.params.id;
    const user = await userService.get(_id);
    return res.ok(user.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 91,
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
    const user = await userService.get(token._userId);
    if (!user) {
      return res
        .status(400)
        .send({ msg: 'We were unable to find a user for this token.' });
    }

    if (user.active)
      return res.status(400).send({
        type: 'already-verified',
        msg: 'This user has already been verified.'
      });

    return res.ok(user.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 94,
        msg: 'user_token_read'
      })
    );
  }
}

async function confirm(req, res, next) {
  try {
    const _token = req.body.token;
    const user = await userService.activateUser(_token);
    return res.ok(user.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 92,
        msg: 'user_update'
      })
    );
  }
}

async function update(req, res, next) {
  try {
    const data = req.body;
    const _id = req.params.id;
    const user = await userService.update(_id, data);
    return res.ok(user.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 92,
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
        code: 93,
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
//             code: 24,
//             msg: 'user_list'
//         }));
//     }
// }

module.exports = {
  validateParams: (rq, rs, nt) => nt(), // TODO: implement data validation
  create,
  get,
  getInactiveByToken,
  confirm,
  update,
  remove
};
