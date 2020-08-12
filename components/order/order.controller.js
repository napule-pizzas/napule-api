const Error = require('@hapi/boom');
const { toObjectOptions } = require('../../libs/util');

const orderService = require('./order.service');

async function create(req, res, next) {
  try {
    const data = req.body;
    const order = await orderService.create(data);
    return res.status(201).json(order.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'order_create'
      })
    );
  }
}

async function get(req, res, next) {
  try {
    const _id = req.params.id;
    const order = await orderService.get(_id);
    return res.ok(order.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'order_read'
      })
    );
  }
}

async function update(req, res, next) {
  try {
    const data = req.body;
    const _id = req.params.id;
    const order = await orderService.update(_id, data);
    return res.ok(order.toObject(toObjectOptions));
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'order_update'
      })
    );
  }
}

async function remove(req, res, next) {
  try {
    const _id = req.params.id;
    await orderService.remove(_id);
    return res.ok({ order: { _id, deleted: true } });
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        code: 93,
        msg: 'order_delete'
      })
    );
  }
}

module.exports = {
  validateParams: (req, res, nt) => nt(), // TODO: implement data validation
  create,
  get,
  update,
  remove
};
