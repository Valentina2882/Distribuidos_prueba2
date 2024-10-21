/**
 * @author kevin
 * @version 1.0.0
 * 
 * Server from express
 * esta clase llama a los metodos necesarios para instanciar shopping car
 */

const express = require('express');
const cors = require('cors')

class Server{
    constructor(){
        this.app = express ();
        this.port = 3003;
        this.path = '/api/';
        this.middlewares();
        this.routes();


    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/shopping', require('../routes/shopping.routes'))
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor funcionando en el puerto',this.port);
        });
    }
}

module.exports = Server;