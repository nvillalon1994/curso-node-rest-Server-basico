const { response } = require("express");
const {Producto} = require("../models");

const obtenerProductos = async ( req,res=response ) => {
    const {limite=20,desde = 0}= req.query
    const query={estado:true}
    if((isNaN(Number(desde))) || (isNaN(Number(limite)))){
        
        return res.status(400).json("Error de paginación")
    }

    
    const [total,productos] =await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("categoria","nombre")
            .populate("usuario","nombre")

    ])
    res.json({
            total,
            productos
            
        })
}

const obtenerProductoPorId = async (req,res=response) =>{
    const {id}=req.params
    const productoDb = await Producto.findById(id)
    .populate("categoria","nombre")
    .populate("usuario","nombre")
    
    if(productoDb.estado===false){
        return res.status(400).json({
            msg:"El producto ha sido eliminado"
        })
    }
    res.json(
        productoDb
    )
    
}

 
const crearProducto = async (req,res=response) =>{
    const {estado,usuario,...body} =req.body
    
    

    const productoDb =await Producto.findOne({ nombre:body.nombre.toUpperCase() })
    if(productoDb){
        if(productoDb.estado===false){
            await Producto.findByIdAndUpdate(productoDb, {estado:true})
            return res.json({
                msg:"Producto ha sido activada"
            })
        }
        return res.status(400).json({
            msg:`Producto ${body.nombre} ya existe`
        })
    }
    // console.log(req.categoria._id,"controller")
    
    //Generar la data a guardar
    const data ={
        nombre:body.nombre.toUpperCase(),
        ...body,
        usuario: req.usuario._id
    }
    

    const producto = new Producto(data)

    //Guardar en base de datos
    await producto.save()

    res.status(201).json(
        producto
    )
}

const actualizarProducto = async (req,res=response)=>{
    const {id} = req.params
    
    const {estado,usuario,...data} =req.body
     if(data.nombre){
        data.nombre = data.nombre.toUpperCase()
     }
     data.usuario = req.usuario._id
    
    const producto = await Producto.findByIdAndUpdate(id,data,{new:true})

    res.json(
        producto
        
    )

}

const borrarProducto = async (req,res=response)=>{
    const {id}=req.params
    const producto = await Producto.findByIdAndUpdate(id, {estado:false} , {new:true})
    
    res.json({
        msg:"El producto se ha eliminado",
        producto
    })
}

module.exports={
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    borrarProducto
}