const { Router } = require("express");
const { check } = require("express-validator");
const validarCampos = require("../middlewares/validar-campos");
const router = Router();
const { login, googleSingIn } = require("../controllers/auth.controller");

router.post("/login", [
    check("correo","El correo es obligatorio").isEmail(),
    check("password","La contraseña es obligatorio").not().isEmpty(),
    validarCampos
],login);
router.post("/google", [
    check("id_token","El id_token es obligatorio").not().isEmpty(),
    
    validarCampos
],googleSingIn);

module.exports = router;
