/**
 * @author kevin
 * @version 1.0.0
 * 
 * Rutas de usuario
 * este archivo define las rutas de shopping car
 */

const{Router} = require('express');
const router = Router();

const {checkout,deleteProducto, AddProductsShopping,getCartItems,GetShoppingCart} = require('../controllers/shopping.controller')

router.get('/', checkout);
router.delete('/:id', deleteProducto);  
router.post('/',AddProductsShopping );
router.get('/:id', getCartItems);
router.post('/shopping-cart', GetShoppingCart);


module.exports = router;
