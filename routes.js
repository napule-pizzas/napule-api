const loginRouter = require('./components/login/login.router.js');
const usersRouter = require('./components/user/user.router.js');
const pizzasRouter = require('./components/pizza/pizza.router');
const ordersRouter = require('./components/order/order.router');
const paymentsRouter = require('./components/payment/payment.router');
const preferencesRouter = require('./components/payment/preference.router');

const logRes = require('./libs/logger').logRes;

function init(app) {
  const v = process.env.API_VER || 'v1';

  app.use(`/${v}/auth`, loginRouter);

  app.use(`/${v}/users`, usersRouter);
  app.use(`/${v}/pizzas`, pizzasRouter);
  app.use(`/${v}/orders`, ordersRouter);
  app.use(`/${v}/preference`, preferencesRouter);
  app.use(`/${v}/payments`, paymentsRouter);

  app.use((req, res) => {
    logRes(req, { msg: 'route_not_found' });
    return res.status(404).json({ msg: 'route_not_found' });
  });
}

module.exports = init;
