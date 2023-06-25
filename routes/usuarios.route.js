const { Router } = require("express");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios.controller");
const { check } = require("express-validator");


const {validarCampos,
  validarJWT,
  esAdminRole,
  tieneRol
}=require('../middlewares/index')

const { esRoleValido, emailExiste, existeUsuarioPorId, isNumber } = require("../helpers/db-validators");


const router = Router();

router.get("/",[
  
], usuariosGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").isLength({ min: 6 }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo", "El correo ya esta registrado").custom(
      emailExiste
    ),
    // check("rol", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.put("/:id",[
  check('id',"No es un ID valido").isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check("rol").custom(esRoleValido),
  validarCampos,
], usuariosPut);

router.patch("/", usuariosPatch);

router.delete("/:id",[
  validarJWT,
  // esAdminRole,
  tieneRol('ADMIN_ROLE','VENTAS_ROLE'),
  check('id',"No es un ID valido").isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos,
], usuariosDelete);

module.exports = router;
