/**
 * @author kevin
 * @version 1.0.0
 * 
 * Controlador de órdenes
 * Este archivo define los controladores de orders
 */

const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client'); 
const axios = require('axios');

const prisma = new PrismaClient();


const GetOrderWithPayment = async (req = request, res = response) => {
    const { orderId } = req.body;  // ID de la orden a buscar

    try {
        // Obtener la orden desde la API de órdenes
        const order = await prisma.orders.findUnique({
            where: { id: orderId }
        });

        // Verificar si se encontró la orden
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Obtener el pago asociado a la orden desde la API de pagos
        const paymentResponse = await axios.get(`http://localhost:3003/payments/${order.paymentId}`);
        const payment = paymentResponse.data;

        // Responder con la orden y el pago
        res.json({
            order,
            payment // Esto incluye el pago asociado
        });
    } catch (error) {
        console.error('Error fetching order with payment:', error.message);
        res.status(500).json({ message: 'Failed to fetch order with payment' });
    } finally {
        await prisma.$disconnect();
    }
};

// Función para obtener los productos basados en sus IDs desde el microservicio de productos
const getProductsForOrder = async (productIds) => {
    try {
        const response = await axios.post('http://localhost:3002/products/getproducts', {
            productIds  
        });
        return response.data.products; 
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch products for the order');
    }
};

const GetOrdersByIds = async (req = request, res = response) => {
    const { orderIds } = req.body;  

    try {
        const orders = await prisma.orders.findMany({
            where: {
                id: { in: orderIds }  // Busca las órdenes cuyos IDs estén en el array `orderIds`
            },
            include: {
                orderItems: true  // Incluye el array `orderItems` en la respuesta
            }
        });
        res.json({
            orders
        });

       


    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Failed to fetch orders' });
    } finally {
        await prisma.$disconnect();
    }
};

// Función para procesar el pago
const processOrderPayment = async (orderId, total, paymentMethod) => {
    try {
        const response = await axios.post('http://localhost:3001/payments/process', {
            orderId,
            amount: total,
            method: paymentMethod
        });
        return response.data;
    } catch (error) {
        console.error('Error processing payment:', error.response ? error.response.data : error.message);
        throw new Error('Payment processing failed');
    }
};

// Mostrar todas las órdenes
const ShowOrders = async (req = request, res = response) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                orderItems: true, // Incluir los productos de la orden
            }
        });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};

// Crear una nueva orden y procesar el pago
// Crear una nueva orden y procesar el pago// Crear una nueva orden y almacenar información detallada de los productos
const AddOrders = async (req = request, res = response) => {
    const { productIds, total, paymentMethod } = req.body;

    try {
        // Paso 1: Obtener los productos del microservicio de productos
        const products = await getProductsForOrder(productIds);

        // Paso 2: Crear la orden y almacenar detalles de los productos
        const order = await prisma.orders.create({
            data: {
                total,
                status: 'pending',
                orderItems: {
                    create: products.map(product => ({
                        productId: product.id,
                        productName: product.name,
                        productPrice: product.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        // Paso 3: Procesar el pago
        const payment = await processOrderPayment(order.id, total, paymentMethod);

        // Paso 4: Actualizar la orden con el paymentId
        const updatedOrder = await prisma.orders.update({
            where: {
                id: { in: orderIds }  // Busca las órdenes cuyos IDs estén en el array `orderIds`
            },
            data: {
                paymentId: payment.payment.id,
                status: 'paid'
            },
            include: {
                orderItems: true // Incluye los productos en la respuesta
            }
        });

        res.json({
            message: 'Order created and payment processed successfully.',
            order: updatedOrder,
            payment
        });
    } catch (error) {
        console.error('Error adding order:', error.message);
        res.status(500).json({ message: 'Failed to create order or process payment' });
    } finally {
        await prisma.$disconnect();
    }
};



// Cancelar una orden
const CancelOrder = async (req = request, res = response) => {
    const { id } = req.params; // Obtenemos el ID de la orden de los parámetros de la URL.

    try {
        const result = await prisma.orders.update({
            where: {
                id: Number(id),
            },
            data: {
                status: "cancelled", // Actualizamos el estado a "cancelado".
            }
        });

        res.json({
            message: `Order with ID ${id} was successfully cancelled.`,
            result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};


module.exports = {
    ShowOrders,
    AddOrders,
    CancelOrder,
    processOrderPayment,
    getProductsForOrder,
    GetOrdersByIds,
    GetOrderWithPayment
};
