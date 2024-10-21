/**
 * @author kevin
 * @version 1.0.0
 * 
 * Rutas de usuario
 * este archivo define las rutas de orders
 */

const{Router} = require('express');
const router = Router();

const {ShowOrders,AddOrders,CancelOrder} = require('../controllers/orders.controller')

router.get('/',ShowOrders);
router.post('/',AddOrders);
router.put('/cancel/:id',CancelOrder)

module.exports = router;
