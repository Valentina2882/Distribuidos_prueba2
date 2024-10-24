/**
 * @author kevin
 * @version 1.0.0
 * 
 * Controlador de pagos
 * Este archivo define los controladores de payments
 */

const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client'); 

const prisma = new PrismaClient();

const processPayment = async (req = request, res = response) => {
    const {amount, method } = req.body;

    try {
        // Crear el pago
        const payment = await prisma.payments.create({
            data: {
                amount,
                method,
                status: 'processed',
                //orderId, // Asegúrate de asociar el ID de la orden
            }
        });

        // Devolver el id del pago
        res.json({
            message: 'Payment processed successfully.',
            payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};

const showPayments = async (req = request, res = response) => {
    try {
        const payments = await prisma.payments.findMany();
        res.json({ payments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};
const GetPaymentsByIds = async (req = request, res = response) => {
    const { paymentIds } = req.body;  

    try {
        const payments = await prisma.payments.findMany({
            where: {
                id: { in: paymentIds }  // Busca los pagos cuyos IDs estén en el array `paymentIds`
            }
        });

        res.json({
            payments
        });
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({ message: 'Failed to fetch payments' });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    processPayment,
    showPayments,
    GetPaymentsByIds
};
