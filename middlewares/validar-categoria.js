const { response } = require("express");
const { Categoria } = require("../models");

const esCategoriaValida =async (req,res=response,next) => {
    
    const categoriaDb = await Categoria.findById(req.body.categoria);
    
    
    
    if (!categoriaDb) {
        
        return  res.status(400).json({
            msg:`La categoria ${req.body.categoria.toUpperCase()} no esta registrado en la base de datos`
        })
    }

    req.categoria=categoriaDb
    next()

}

module.exports={
    esCategoriaValida
}