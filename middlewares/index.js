const validarCampos = require("./validar-campos");
const { validarJWT } = require("./validar-jwt");
const { esAdminRole,tieneRol } = require("./validar-roles");
const {validarArchivoSubir} = require('./validar-archivo')

module.exports={
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol,
    validarArchivoSubir
}