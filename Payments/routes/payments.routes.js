/**
 * @author Zare
 * @version 1.0.0
 * 
 * Rutas de usuario
 * este archivo define las rutas de orders
 */

const{Router} = require('express');
const router = Router();

const {processPayment,showPayments,GetPaymentsByIds} = require('../controllers/payments.controller')

router.get('/',showPayments);
router.post('/process', processPayment);
router.post('/:getpayments', GetPaymentsByIds);


module.exports = router;
