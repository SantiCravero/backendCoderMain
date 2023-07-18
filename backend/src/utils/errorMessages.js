import passport from "passport";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/userService.js";

export const passportError = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        //Errores del Token (token no valido, no posee el formato adecuado o no existe, etc)
        return next(error);
      }

      if (!user) {
        return res.status(401).send({
          error: info.message ? info.message : info.toString(),
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const roleVerification = (roles) => {
  return async (req, res, next) => {
    try {
      const cookie = req.cookies["userCookie"];

      if (!cookie) {
        req.logger.fatal("Usuario no encontrado");
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
      const userDB = await findUserById(loguedUser._id);

      if (roles.toUpperCase() !== userDB.role.toUpperCase()) {
        req.logger.info("Usuario no autorizado");
        return res.status(403).json({message:"Usuario no autorizado"})
      }
      
      else{
      req.logger.info("Usuario verificado!");
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error con el servidor" });
    }
  };
};
