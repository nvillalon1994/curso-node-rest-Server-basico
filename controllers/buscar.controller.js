const { response } = require("express");
const { isValidObjectId,ObjectId,Schema,Types, Mongoose } = require("mongoose");
const {Usuario, Categoria, Producto} =require('../models')
const coleccionesPermitidas =[
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = "",res= response)=>{

    const esMongoId = isValidObjectId( termino )//boolean

    if(esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results:(usuario ? [usuario] : [])
        })
    }
    const regex = new RegExp( termino, 'i' )
    console.log(regex)

    const usuarios = await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    })
    const usuariosCantidad = await Usuario.count({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    })
    res.json({
        cantidad:usuariosCantidad,
        results:(usuarios ? [usuarios] : [])

    })


}
const buscarCategorias = async (termino = "",res= response)=>{

    const esMongoId = isValidObjectId( termino )//boolean
    
    if(esMongoId){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results:(categoria ? [categoria] : [])
        })
    }
    const regex = new RegExp( termino, 'i' )
    console.log(regex)

    const categoria = await Categoria.find({nombre:regex,estado:true})
    const categoriaCantidad = await Categoria.count({
        $or:[{nombre:regex}],
        $and:[{estado:true}]
    })
    res.json({
        cantidad:categoriaCantidad,
        results:(categoria ? [categoria] : [])

    })


}
const buscarProductos = async (termino = "",res= response)=>{

    const esMongoId = isValidObjectId( termino )//boolean

    if(esMongoId){
        const producto = await Producto.findById(termino).populate("categoria","nombre")
        if(producto){
            return res.json({
                results:(producto ? [producto] : [])
            })
        }
        const categoria = await Categoria.findById(termino)
        const productoPorCategoria = await Producto.find({categoria: categoria._id}).populate("categoria","nombre")
        return res.json({
            results:(productoPorCategoria ? [productoPorCategoria] : [])
        })
    }
    const regex = new RegExp( termino, 'i' )
    console.log(regex)

    const productos = await Producto.find({nombre:regex,estado:true}).populate("categoria","nombre")
    const productosCantidad = await Producto.count({
        $or:[{nombre:regex},{correo:regex}],
        // $and:[{estado:true}]
    })
    res.json({
        cantidad:productosCantidad,
        results:(productos ? [productos] : [])

    })


}


const buscar =async (req, res = response)=>{
    const { coleccion, termino }=req.params
    
    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg:`Las colecciones son : ${coleccionesPermitidas} `
        })
    }



    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;


        case 'categorias':
            buscarCategorias(termino,res)
        break;

        case 'productos':
            buscarProductos(termino, res)
        break;
        
        default:
            res.status(500).json({
                msg:"Se le olvido hacer esta busqueda"
            })
    }
    


    

}

module.exports={
    buscar
}