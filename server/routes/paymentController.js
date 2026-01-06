// server/routes/paymentRouter.js
const Router = require('express');
const router = new Router();
const paymentController = require('../controllers/paymentController');

// Це створить шлях /api/payment/create-checkout
router.post('/create-checkout', paymentController.create);

module.exports = router;