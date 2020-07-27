const Error = require('@hapi/boom');

const pizzaService = require('./pizza.service');

// async function create(req, res, next) {
//   try {
//     const data = req.body;
//     const order = await pizzaService.create(data);
//     return res.status(201).json({ order });
//   } catch (e) {
//     return next(
//       Error.badImplementation(e, {
//         msg: 'order_create'
//       })
//     );
//   }
// }

// async function get(req, res, next) {
//   try {
//     const _id = req.params.id;
//     const order = await pizzaService.get(_id);
//     return res.ok({ order });
//   } catch (e) {
//     return next(
//       Error.badImplementation(e, {
//         msg: 'order_read'
//       })
//     );
//   }
// }

// async function update(req, res, next) {
//   try {
//     const data = req.body;
//     const _id = req.params.id;
//     const order = await pizzaService.update(_id, data);
//     return res.ok({ order });
//   } catch (e) {
//     return next(
//       Error.badImplementation(e, {
//         msg: 'order_update'
//       })
//     );
//   }
// }

// async function remove(req, res, next) {
//   try {
//     const _id = req.params.id;
//     await pizzaService.remove(_id);
//     return res.ok({ order: { _id, deleted: true } });
//   } catch (e) {
//     return next(
//       Error.badImplementation(e, {
//         code: 93,
//         msg: 'order_delete'
//       })
//     );
//   }
// }

async function list(req, res, next) {
  try {
    const pizzas = await pizzaService.list();
    return res.ok(pizzas);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'pizza_list'
      })
    );
  }
}

module.exports = {
  validateParams: (req, res, nt) => nt(), // TODO: implement data validation
  list
};
