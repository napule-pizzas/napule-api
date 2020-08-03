const Error = require('@hapi/boom');

const paymentService = require('./payment.service');

const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

async function preference(req, res, next) {
  try {
    const data = req.body;
    const preference = paymentService.buildPreference(data);
    const mpResponse = await mercadopago.preferences.create(preference);

    await paymentService.create({
      order: data.id,
      status: 'pending',
      method: ''
    });

    return res.status(200).json(mpResponse.body);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'payment_create'
      })
    );
  }
}

async function webhook(req, res, next) {
  try {
    const data = req.body;
    if (data.type === 'payment') {
      const mpResponse = await mercadopago.payment.get(data.data.id);

      console.log('MP PAYMENT', payment);

      const orderId = mpResponse.body.external_reference.replace('pedido-', '');
      const payment = await paymentService.findByOrder(orderId);

      console.log('PAYMENT', payment);

      payment.status = mpResponse.status;

      payment.save();
    }
    res.sendStatus(200);
  } catch (e) {
    return next(
      Error.badImplementation(e, {
        msg: 'payment_create'
      })
    );
  }
}

module.exports = {
  preference,
  webhook
};
