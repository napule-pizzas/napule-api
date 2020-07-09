const Error = require('@hapi/boom');
const toObjectOptions = require('../../libs/util');

const userService = require('./user.service');

async function create(req, res, next) {
  try {
    const data = req.body;
    let user = await userService.create(data);
    user = user.toObject({ getters: true, virtuals: false, versionKey: false });
    delete user.passwordHash;
    delete user.emailConfirmationToken;

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
  update,
  remove
};
