const express = require('express');
const router = express.Router();

const ctrl = require('./order.controller');

router.get('/:id', ctrl.validateParams, ctrl.get);
router.post('/', ctrl.validateParams, ctrl.create);
router.patch('/:id', ctrl.validateParams, ctrl.update);

// @@ TODO: move these endpoints to admin
// router.get('/:id', ctrl.validateParams, ctrl.get);
// router.delete('/:id', ctrl.validateParams, ctrl.delete);

module.exports = router;
