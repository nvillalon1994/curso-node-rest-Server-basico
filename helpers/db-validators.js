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

const isNumber =(limit)=>{
    console.log(limit)
}
module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    isNumber
}


