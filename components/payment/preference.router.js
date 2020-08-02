const express = require('express');
const router = express.Router();

const ctrl = require('./payment.controller');

router.post('/', ctrl.preference);

module.exports = router;
