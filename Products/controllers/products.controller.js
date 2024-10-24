/**
 * @author
 * @version 1.0.0
 * 
 * Controlador de usuario
 * Esta archivo define los controladores de products
 */

const {response, request} = require('express');
const { PrismaClient } = require('@prisma/client');
const {Encrypt , Decrypt} =require('../middlewares/validate')

const prisma = new PrismaClient();


const GetProductsByIds = async (req = request, res = response) => {
    const { productIds } = req.body;  

    console.log("ProductsIds",req.body)
    try {
        const products = await prisma.products.findMany({
            where: {
                id: { in: productIds }  // Busca los productos cuyos IDs estén en el array `productIds`
            }
        });

        res.json({
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Failed to fetch products' });
    } finally {
        await prisma.$disconnect();
    }
};

const ShowProducts = async (req=request, res=response)=>{
    const products = await prisma.products.findMany()
    .catch(err=>{

        return err.message;
    }).finally((async()=>{
        await prisma.$disconnect();
    }))
    res.json({
        products
    })

}
const AddProducts = async (req=request, res=response)=>{
    const {name,description,price,stock,category} = req.body;

    const result = await prisma.products.create({
        data: {
            name,
            description,
            price,
            stock,
            category
        }
    }).catch(err=>{

        return err.message;
    }).finally((async()=>{
        await prisma.$disconnect();
    }))
    res.json({
        result
    })
}
const EditProducts = async (req=request, res=response)=>{
    const{ id } = req.params;
    const {name,description,price,stock,category} = req.body;

    const result = await prisma.products.update({
        where:{
            id : Number(id)
        },
        data: {
            name,
            description,
            price,
            stock,
            category
        }
    }).catch(err=>{

        return err.message;
    }).finally((async()=>{
        await prisma.$disconnect();
    }))
    res.json({
        result
    })

}
const DeleteProducts = async (req=request, res=response)=>{
    const{ id } = req.params;

    const result = await prisma.products.delete({
        where:{
            id : Number(id)
        }
    }).catch(err=>{

        return err.message;
    }).finally((async()=>{
        await prisma.$disconnect();
    }))
    res.json({
        result
    })
}
const ShowProduct = async (req=request, res=response)=>{
    res.json({
        "saludo":"respuestaa"
    })
}
module.exports = {
    ShowProducts,
    AddProducts,
    EditProducts,
    DeleteProducts,
    ShowProduct,
    GetProductsByIds
};