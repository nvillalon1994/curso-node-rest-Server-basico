const { Router } = require("express");
const { check } = require("express-validator");
const validarCampos = require("../middlewares/validar-campos");
const { crearCategoria } = require("../controllers/categorias.controller");
const { validarJWT, esAdminRole } = require("../middlewares");

const { crearProducto,
        obtenerProductos,
        obtenerProductoPorId,
        actualizarProducto,
        borrarProducto } = require("../controllers/productos.controller");

const { esCategoriaValida } = require("../middlewares/validar-categoria");
const { existeProducto } = require("../helpers/db-validators");
const router = Router();

/**
 * {{url}}/api/producto
 */

//obtener todas las producto - publico
router.get("/",obtenerProductos)

//obtener una categoria por id - publico
router.get("/:id",[
    check("id","El id no es válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos
],obtenerProductoPorId)

//Crear una categoria - privado- cuaquier persona con token valido
router.post("/",[
    validarJWT,
    esAdminRole,
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    check("descripcion","La descripción es obligatoria").not().isEmpty(),
    check("categoria","La categoria es obligatoria").not().isEmpty(),
    check("categoria","No es id de mongo").isMongoId(),
    
    // esCategoriaValida,
    validarCampos

],crearProducto)

//Actualizar un registro por id - privado- cuaquier persona con token valido
router.put("/:id",[
    validarJWT,
    esAdminRole,
    check("id","El id no es válido").isMongoId(),
    check("id").custom(existeProducto),
    esCategoriaValida,
    check("categoria","No es id de mongo").isMongoId(),
    validarCampos 
],actualizarProducto)

//Borrar una categoria por id - privado- cuaquier persona con rol admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id","El id no es válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos 
],borrarProducto)

module.exports = router;