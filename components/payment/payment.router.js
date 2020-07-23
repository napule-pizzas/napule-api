const express = require('express');
const router = express.Router();

const ctrl = require('./payment.controller');

router.get('/mp-access-token', function mpAccessToken(req, res) {
  return res.status(200).json({ mpAccessToken: process.env.MP_ACCESS_TOKEN });
});

router.post('/', ctrl.create);

router.post('/webhook', function mpAccessToken(req, res) {
  console.log('WEBHOOK, Not yet implemented', req, res);
});

module.exports = router;
