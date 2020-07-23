const express = require('express');
const router = express.Router();

router.get('/mp-access-token', function mpAccessToken(req, res) {
  return res.status(200).json({ mpAccessToken: process.env.MP_ACCESS_TOKEN });
});

router.post('/webhooks', function mpAccessToken(req, res) {
  console.log('WEBHOOKS, Not yet implemented', req, res);
});

module.exports = router;
