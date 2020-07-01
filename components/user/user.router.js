const express = require('express');
const router = express.Router();

const ctrl = require('./user.controller');

router.get('/', ctrl.validateParams, ctrl.get);
router.get('/:id', ctrl.validateParams, ctrl.get);

// @@ TODO: move these endpoints to admin
// router.post('/', ctrl.validateParams, ctrl.create);
// router.patch('/:id', ctrl.validateParams, ctrl.update);
// router.delete('/:id', ctrl.validateParams, ctrl.remove);

module.exports = router;
