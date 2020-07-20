const express = require('express');
const router = express.Router();

const ctrl = require('./user.controller');

router.get('/', ctrl.validateParams, ctrl.get);
router.get('/:id', ctrl.validateParams, ctrl.get);
router.get('/inactive/:token', ctrl.validateParams, ctrl.getInactiveByToken);
router.patch('/:id', ctrl.validateParams, ctrl.update);
router.post('/', ctrl.validateParams, ctrl.create);
router.post('/confirm', ctrl.validateParams, ctrl.confirm);
router.get('/resend/:id', ctrl.validateParams, ctrl.resend);
// router.post('/confirmation', ctrl.confirmationPost);
// router.post('/resend', ctrl.resendTokenPost);

// @@ TODO: move these endpoints to admin
// router.delete('/:id', ctrl.validateParams, ctrl.remove);

module.exports = router;
