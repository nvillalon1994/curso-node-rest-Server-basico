const { response } = require("express");
const {Categoria} = require("../models");

//obtenerCategorias - paginado - total- populate
const obtenerCategorias=async(req, res)=> {
    // const {q,nombre ="no name",apikey,page = 1 ,limit} = req.query
    
    const {limite=20,desde = 0}= req.query
    const query={estado:true}
    if((isNaN(Number(desde))) || (isNaN(Number(limite)))){
        
        return res.status(400).json("Error de paginación")
    }

    
    const [total,categorias] =await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')

    ])
    res.json({
            total,
            categorias
            
        })
}


//obtenerCategoria -populate {}

const obtenerCategoria=async(req,res =response)=>{

    const {id}= req.params
    const categoriaExiste = await Categoria.findById(id).populate("usuario","nombre")
    
    if(!categoriaExiste){
        console.log("no existe")
        return res.status(400).json({
            msg:"La categoria no existe"
        })
    }
    if(categoriaExiste.estado===false){
        return res.status(400).json({
            msg:"La categoria no existe-estado false"
        })
    }
    
    res.json({
        categoriaExiste
    })


}
const crearCategoria = async(req,res=response) => {

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDb =await Categoria.findOne({ nombre })
    if(categoriaDb){
        if(categoriaDb.estado===false){
            await Categoria.findByIdAndUpdate(categoriaDb, {estado:true})
            return res.json({
                msg:"Esta categoría ha sido activada"
            })
        }
        return res.status(400).json({
            msg:`La categoria ${nombre} ya existe`
        })
    }
    

    //Generar la data a guardar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    //Guardar en base de datos
    await categoria.save()

    res.status(201).json(
        categoria
    )


}

//actualizarCategoria 
const actualizarCategoria = async(req,res=response) => {
    const {id}=req.params
    const {estado,usuario,...data}=req.body
    data.nombre =data.nombre.toUpperCase()
    data.usuario=req.usuario
    const categoria =await Categoria.findByIdAndUpdate(id, data, {new:true})

    res.json({
        categoria
    })

}


//borrarCategoria - estado:false
const borrarCategoria= async (req,res=response) =>{
    const {id}=req.params
    const categoria =await Categoria.findByIdAndUpdate(id, {estado:false},{new:true})
    res.json({
        categoria,
        msg:"Categoría eliminada"
    })
}

 
module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}