const express = require('express')
const router = express.Router();
//route
const {processPayment} = require('../controllers/paymentController');
const {sendStripeApi} = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/payment/process').post(isAuthenticatedUser,processPayment);
router.route('/stripeapi').get(isAuthenticatedUser,sendStripeApi);

module.exports = router;