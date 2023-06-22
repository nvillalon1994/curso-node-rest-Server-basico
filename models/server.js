const express = require('express')
const cors = require('cors')


class Server{

    constructor(){

        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'




        //middelwares
        this.middelwares()


        //rutas de mi app
        this.routes()

    }
    middelwares(){
        //cors
        this.app.use( cors() )

        // Parseo y lectura del body
        this.app.use( express.json())
        
        //directorio publico
        this.app.use( express.static('public'))
    }
    routes() {

        this.app.use(this.usuariosPath,require('../routes/usuarios.route'))

    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }

}

module.exports = Server