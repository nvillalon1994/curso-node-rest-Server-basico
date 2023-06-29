const { Router } = require("express");
const { check } = require("express-validator");
const {validarJWT,validarCampos, tieneRol} = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias.controller");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/categorias
 */

//obtener todas las categorias - publico
router.get("/",obtenerCategorias)

//obtener una categoria por id - publico
router.get("/:id",[
    
    check('id',"No es un ID valido").isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],obtenerCategoria)

//Crear una categoria - privado- cuaquier persona con token valido
router.post('/',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)

//Actualizar un registro por id - privado- cuaquier persona con token valido
router.put("/:id",[
    validarJWT,
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    tieneRol('ADMIN_ROLE'),
    check('id',"No es un ID valido").isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],actualizarCategoria)

//Borrar una categoria por id - privado- cuaquier persona con rol admin
router.delete("/:id",[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id',"No es un ID valido").isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],borrarCategoria)

module.exports = router;
