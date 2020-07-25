const Error = require('@hapi/boom');

const paymentService = require('./payment.service');

const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

async function create(req, res, next) {
  try {
    const data = req.body;
    const preference = paymentService.buildPreference(data);

    const mpResponse = await mercadopago.preferences.create(preference);

    return res.status(200).json(mpResponse.body);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'payment_create'
      })
    );
  }
}

module.exports = {
  create
};
