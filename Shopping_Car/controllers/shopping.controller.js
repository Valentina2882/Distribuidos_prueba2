/**
 * @author kevin
 * @version 1.0.0
 * 
 * Controlador de carrito de compras
 * Este archivo define los controladores de shopping
 */
7
const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Función para calcular el total del carrito
const calculateTotal = (products) => {
    return products.reduce((total, product) => total + product.price, 0);
};

// Agregar un producto al carrito
const AddProductsShopping = async (req = request, res = response) => {
    const { productIds, quantity } = req.body;

    try {
        // Paso 1: Verificar si hay un carrito existente o crear uno nuevo
        let cart = await prisma.shoppingCart.findFirst();

        if (!cart) {
            cart = await prisma.shoppingCart.create({
                data: {
                    createdAt: new Date(),
                },
            });
        }

        // Paso 2: Obtener los productos del microservicio de productos
        const products = await getProductsByIds(productIds);

        // Paso 3: Crear las entradas en el carrito con detalles del producto
        const cartItems = await prisma.shoppingCartItem.createMany({
            data: products.map(product => ({
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                quantity: quantity || 1, // Si no envías cantidad, por defecto será 1
                cartId: cart.id, // Asignar al carrito existente
            }))
        });

        res.json({
            message: 'Products added to shopping cart successfully.',
            cartItems
        });
    } catch (error) {
        console.error('Error adding products to cart:', error.message);
        res.status(500).json({ message: 'Failed to add products to cart' });
    } finally {
        await prisma.$disconnect();
    }
};

// Obtener todos los elementos del carrito
const getCartItems = async (req = request, res = response) => {
    const { cartId } = req.params; // Asegúrate de que cartId sea pasado desde el cliente

    if (!cartId) {
        return res.status(400).json({ message: 'Cart ID is required' });
    }

    try {
        const items = await prisma.shoppingCartItem.findMany({
            where: { cartId: Number(cartId) }, // Convierte a número si es necesario
        });

        if (!items.length) {
            return res.status(404).json({ message: 'No items found in the shopping cart.' });
        }

        const total = items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
        
        res.json({
            items,
            total,
        });
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
        res.status(500).json({ message: 'Failed to fetch cart items' });
    }
};

// Eliminar un producto del carrito
const deleteProducto = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const deletedItem = await prisma.shoppingCartItem.delete({
            where: {
                id: Number(id),
            },
        });

        res.json({
            message: `Product with ID ${id} was successfully removed from the shopping cart.`,
            deletedItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};

// Realizar el checkout
const checkout = async (req = request, res = response) => {
    try {
        // Obtener los elementos del carrito con detalles de los productos
        const cartItems = await prisma.shoppingCartItem.findMany({
            include: {
                cart: true,  // Incluye detalles del carrito si es necesario
            }
        });

        if (!cartItems.length) {
            return res.status(400).json({ message: 'Shopping cart is empty' });
        }

        // Calcular el total basado en los precios de los productos en el carrito
        const total = cartItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);

        // Aquí podrías realizar el proceso de pago, si fuese necesario.

        // Primero, eliminar los elementos del carrito
        await prisma.shoppingCartItem.deleteMany();

        // Después, eliminar el carrito
        await prisma.shoppingCart.deleteMany();

        // Devolver el detalle de los productos y el total
        res.json({
            message: 'Checkout successful and cart cleared.',
            total,
            cartItems  // Incluye los detalles de los productos que estaban en el carrito
        });
    } catch (error) {
        console.error('Error during checkout:', error.message);
        res.status(500).json({ message: 'Checkout failed' });
    } finally {
        await prisma.$disconnect();
    }
};


const GetShoppingCart = async (req = request, res = response) => {
    const { orderId } = req.body; // Asumiendo que solo pasas el orderId

    try {
        // Inicializar resultados vacíos
        let order = null;
        let payment = null;

        // Obtener la orden usando el orderId
        if (orderId) {
            try {
                const orderResponse = await axios.post('http://localhost:3000/orders/getorders', {
                    params: { ids: [orderId] } // Pasamos el orderId como un array
                });
                console.log("Ordenes ", orderResponse.data)
                order = orderResponse.data.orders[0]; // Suponiendo que solo hay una orden por ID
            } catch (error) {
                console.error('Error fetching order:', error.response ? error.response.data : error.message);
                throw new Error('Failed to fetch order');
            }
        }

        // Obtener el pago asociado a la orden
        if (order && order.paymentId) {
            try {
                const paymentResponse = await axios.post('http://localhost:3001/payments/getpayments', {
                    params: { ids: [order.paymentId] }
                });
                payment = paymentResponse.data.payments[0]; // Suponiendo que solo hay un pago por ID
            } catch (error) {
                console.error('Error fetching payment:', error.response ? error.response.data : error.message);
                throw new Error('Failed to fetch payment');
            }
        }

        // Responder con la información del carrito de compras
        res.json({
            order: {
                id: order.id,
                total: order.total,
                status: order.status,
                paymentId: order.paymentId,
                orderItems: order.orderItems, // Incluye los items de la orden
            },
            payment, // Pago asociado a la orden
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Failed to fetch data' });
    } finally {
        await prisma.$disconnect();
    }
};



module.exports = {
    AddProductsShopping,
    deleteProducto,
    checkout,
    calculateTotal,
    getCartItems,
    GetShoppingCart
};
