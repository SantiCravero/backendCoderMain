import { validatePassword } from "../utils/bcrypt.js";
import {  managerUser } from "./user.controller.js";

export const getSession = async (req, res) => {
  if (req.session.login) {
    res.redirect("/product", 200, {
      message: "Bienvenido/a a mi tienda",
    });
  } else {
    res.status(200).json({
      status: "failure",
      response: "No existe sesion activa",
    });
  }
};

export const testLogin = async (req, res) => {
  const { email, password } = req.body;

  
  try {
    const user = await managerUser.getUserByEmail(email);
    
    if (email === "adminCoder@coder.com" && validatePassword("adminCod3r123", user.password)) {
      req.session.login = true;
      req.session.name = user.first_name;
      req.session.role = user.role;
  
      return res.status(200).json({
        status: "success",
        message: `Bienvenido ${req.session.name}, tu rol es ${req.session.role}`
      });
    }

    if (user && validatePassword(password, user.password)) {
      req.session.login = true;

      res.status(200).json({
        status: "succes",
        message: "Bienvenido/a a mi tienda"
      })

    } else {
      res.status(200).json({
        message: "Usuario o contraseña incorrectos",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const destroySession = async (req, res) => {
  if (req.session.login) {
    req.session.destroy();

    res.status(200).json({
      status: "success",
      message: "La sesion ha terminado, adios",
    });
  } else {
    res.status(200).json({
      status: "failure",
      response: "No existe sesion activa",
    });
  }
};
