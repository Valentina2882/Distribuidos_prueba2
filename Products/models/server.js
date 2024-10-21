/**
 * @author
 * @version 1.0.0
 * 
 * Servidor de express 
 * Esta clase llama a los metodos necesarios para instanciar un servidor
 */

/**
 * Importacion de variables
 */

const express = require('express');
const cors = require('cors')

/**
 * @class Server 
 * clase servidor que inicia el servidor de express
 */

class Server {
    constructor(){
        this.app = express(); //controlar todo lo relacionado a express
        this.port = 3002; //controlar el puerto 
        this.path = '/api/'; // crear la carpeta api
        this.middlewares();
        this.routes();

    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    routes(){
        this.app.use('/products', require('../routes/products.routes'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor funcionando en el puerto',this.port);
        })
    }

}

module.exports = Server;
