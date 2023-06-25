const {response} = require('express')
const bcryptjs= require('bcryptjs')
const Usuario= require('../models/usuario')


const usuariosGet=async(req, res)=> {
    // const {q,nombre ="no name",apikey,page = 1 ,limit} = req.query
    
    const {limite=20,desde = 0}= req.query
    const query={estado:true}
    if((isNaN(Number(desde))) || (isNaN(Number(limite)))){
        
        return res.status(400).json("Error de paginación")
    }

    
    const [total,usuarios] =await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

    ])
    res.json({
            total,
            usuarios   
            
        })
}
const usuariosPost=async(req, res)=> {

    const {nombre, correo, password, rol} = req.body
    const usuario = new Usuario( {nombre, correo, password, rol} )
    
    //encriptar la contraseña

    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt )


    //Guardar en base de datos

    await usuario.save()

    res.json({
        msg:"post Api - controlador",
        usuario
    })
}

const usuariosPut=async(req, res)=> {
    const {id} = req.params
    const {_id, password, google,correo,...resto }= req.body

    //TODO validad contra base de datos
    if( password ){
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }
     const usuario = await Usuario.findByIdAndUpdate( id , resto )

    res.json({
            
            usuario
        })
}
const usuariosPatch=(req, res)=> {
    res.json({
            msg:"patch Api - controlador"
        })
}
const usuariosDelete=async(req, res)=> {
    const {id} =req.params

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id )

    const usuario = await Usuario.findByIdAndUpdate(id,  {estado:false} )

    res.json({
            msg:"delete Api - controlador",
            usuario
        })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete  
}