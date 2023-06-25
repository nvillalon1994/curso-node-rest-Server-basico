const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT.JS");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }
    //verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Estado:false",
      });
    }
    //Verficar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Password",
      });
    }
    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login Ok",
      usuario,token
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

module.exports = {
  login,
};
