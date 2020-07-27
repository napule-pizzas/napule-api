const Error = require('@hapi/boom');
const mcache = require('memory-cache');

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

function cache(duration) {
  return function (req, res, next) {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.ok(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.ok = function (body) {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
}

module.exports = {
  validateParams: (req, res, nt) => nt(), // TODO: implement data validation
  cache,
  list
};
