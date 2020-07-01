const express = require('express');
const router = express.Router();

const ctrl = require('./order.controller').default;

router.get('/', ctrl.validateParams, ctrl.get);
router.post('/', ctrl.validateParams, ctrl.create);

// @@ TODO: move these endpoints to admin
// router.get('/:id', ctrl.validateParams, ctrl.get);
// router.patch('/:id', ctrl.validateParams, ctrl.update);
// router.delete('/:id', ctrl.validateParams, ctrl.delete);

export default router;
