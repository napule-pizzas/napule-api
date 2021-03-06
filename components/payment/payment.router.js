const express = require('express');
const router = express.Router();

const ctrl = require('./payment.controller');

router.post('/webhook', ctrl.webhook);

module.exports = router;
