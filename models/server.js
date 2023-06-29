const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')


class Server{

    constructor(){

        this.app = express()
        this.port = process.env.PORT

        this.paths={
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            
        }
        
        

        //Conectar a base de datos
        this.conectarDB()



        //middelwares
        this.middelwares()


        //rutas de mi app
        this.routes()

    }

    async conectarDB(){
        await dbConnection()
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

        this.app.use(this.paths.auth,require('../routes/auth.route'))
        this.app.use(this.paths.buscar,require('../routes/buscar.route'))
        this.app.use(this.paths.categorias,require('../routes/categorias.route'))
        this.app.use(this.paths.productos,require('../routes/productos.route'))
        this.app.use(this.paths.usuarios,require('../routes/usuarios.route'))
        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }

}

module.exports = Server