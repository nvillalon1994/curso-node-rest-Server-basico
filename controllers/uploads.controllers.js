const path = require('path')
const fs = require('fs')
const { response } = require("express");
const { subirArchivos } = require("../helpers/subir-archivo");
const {Usuario,Producto} = require("../models");
const cloudinary = require('cloudinary').v2
// cloudinary.config( process.env.CLOUDINARY_URL )
cloudinary.config({
    cloud_name: 'dmqm1wfts',
    api_key: '726596348623996',
    api_secret: 'amtnzvWyr4JZyOFpokFHs_Fgy9g'
})


const cargarArchivo = async(req, res = response) => {
    
    // //Imagenes
    // const nombre = await subirArchivos(req.files,undefined,"img")
    //TXT, MD
    // const nombre = await subirArchivos(req.files,['txt','md'],"textos")
    try {
        const nombre = await subirArchivos(req.files,undefined,"img")
        res.json({
            nombre
        })
    } catch(msg){
        return res.status(400).json({
            msg:msg
        })
    }


};


const actualizarImagen=async(req,res=response)=>{
    const {id,coleccion} = req.params
    
    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un usuario con ese id"
                })
            } 
        break;

        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un producto con ese id"
                })
            }
        break 

        default:
            return res.status(500).json({msg:"se me olvido validar esto"})
    }
    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen= path.join(__dirname,'../uploads',coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }
    try{
        const image=await subirArchivos(req.files,undefined, coleccion)
        modelo.img= image
        await modelo.save()
    
        res.json(
            modelo 
        ) 
    }catch(error){
        return res.status(400).json({
            msg:error
        })
    } 
}

const actualizarImagenCloudinary=async(req,res=response)=>{
    const {id,coleccion} = req.params
    
    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un usuario con ese id"
                })
            } 
        break;

        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un producto con ese id"
                })
            }
        break 

        default:
            return res.status(500).json({msg:"se me olvido validar esto"})
    }
    //Limpiar imagenes previas
    if(modelo.img){
        const nombreArr=modelo.img.split("/")
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id]= nombre.split('.')
        
        cloudinary.uploader.destroy(`${coleccion}/${modelo._id}/${public_id}`,function(error,result) {
            console.log(result, error) })
        
    }
    const {tempFilePath,name}= req.files.archivo
    const {secure_url} =await cloudinary.uploader.upload( tempFilePath,
        {folder:`${coleccion}/${modelo._id}`}
        )
    modelo.img= secure_url
    await modelo.save()
    res.json(modelo)
    
}

const mostrarImagen =async (req,res=response)=>{
    const {id,coleccion} = req.params
    
    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un usuario con ese id"
                })
            } 
        break;

        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"No existe un producto con ese id"
                })
            }
        break 

        default:
            return res.status(500).json({msg:"se me olvido validar esto"})
    }
    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen= path.join(__dirname,'../uploads',coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }
    const noImage=path.join(__dirname,"../assets","no-image.jpg")
    if(fs.existsSync(noImage)){
        return res.sendFile(noImage)
    }
    
}


module.exports = {
    actualizarImagen,
    cargarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary
};
