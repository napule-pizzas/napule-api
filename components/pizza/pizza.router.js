const express = require('express');
const router = express.Router();

const ctrl = require('./pizza.controller');

router.get('/', ctrl.validateParams, ctrl.list);

// @@ TODO: move these endpoints to admin
// router.post('/', ctrl.validateParams, ctrl.create);
// router.get('/:id', ctrl.validateParams, ctrl.get);
// router.patch('/:id', ctrl.validateParams, ctrl.update);
// router.delete('/:id', ctrl.validateParams, ctrl.delete);

module.exports = router;
