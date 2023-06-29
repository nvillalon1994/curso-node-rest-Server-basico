const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");


const esRoleValido =async (rol = "") => {
    const existeRol = await Role.findOne({ rol });
    
    
    if (!existeRol) {
      
      throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

  
const emailExiste =async(correo="")=>{
    const email = await Usuario.findOne({correo})
    
    if (email){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}


const existeUsuarioPorId=async(id)=>{
    
    const existeUsuario = await Usuario.findById(id)
    
    if(!existeUsuario ){
        throw new Error(`El usuario con id ${id} no existe`)
    }
}

/**
 * Categorias
 * @param {*} id 
 */
const existeCategoria=async(id)=>{
    
    const categoriaExiste = await Categoria.findById(id)
    
    if(!categoriaExiste ){
        throw new Error(`La categoria con id ${id} no existe`)
    }
    
}

/**
 * Productos
 */
const existeProducto=async(id)=>{
    
    const productoExiste = await Producto.findById(id)
    
    if(!productoExiste ){
        throw new Error(`El producto con id ${id} no existe`)
    }
    if(productoExiste.estado===false ){
        throw new Error(`El producto con id ${id} ya fue eliminado`)
    }
    
}



module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    
    existeCategoria,
    existeProducto
    

}


