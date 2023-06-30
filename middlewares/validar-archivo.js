const { response } = require("express")

const validarArchivoSubir = (req,res=response,next)=>{
    if (!req.files || Object.keys(req.files).length === 0||!req.files.archivo) {
        return res.status(400).json({mgs:"No hay archivos que subir-archivo validar"});
    }
    next()
}

module.exports={
    validarArchivoSubir
}