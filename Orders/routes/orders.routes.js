/**
 * @author kevin
 * @version 1.0.0
 * 
 * Rutas de usuario
 * este archivo define las rutas de orders
 */

const{Router} = require('express');
const router = Router();

const {ShowOrders,AddOrders,CancelOrder,GetOrdersByIds,GetOrderWithPayment} = require('../controllers/orders.controller')

router.get('/',ShowOrders);
router.post('/',AddOrders);
router.put('/cancel/:id',CancelOrder);
router.post('/:getorders', GetOrdersByIds);
router.post('/order-with-payment', GetOrderWithPayment);


module.exports = router;
