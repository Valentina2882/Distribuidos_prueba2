/**
 * @author kevin
 * @version 1.0.0
 * 
 * Rutas de usuario
 * este archivo define las rutas de shopping car
 */

const{Router} = require('express');
const router = Router();

const {checkout,deleteProducto, AddProductsShopping,getCartItems} = require('../controllers/shopping.controller')

router.get('/', checkout);
router.delete('/:id', deleteProducto);  
router.post('/',AddProductsShopping );
router.get('/:id', getCartItems);  



module.exports = router;
