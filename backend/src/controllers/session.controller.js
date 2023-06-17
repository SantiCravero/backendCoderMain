import passport from "passport";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import { transporter } from "../utils/email.js";
import { findUserByEmail, findUserById, updateUser } from "../services/userService.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

export const registerUser = async (req, res, next) => {
    try {
        passport.authenticate('register', async (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: `Error en registro`,
                    error: err.message
                })
            }
            if (!user) {
                return res.status(401).send(`El email ingresado ya esta en uso`)
            }

            return res.status(200).send(`Usuario registrado con exito`)
        })(req, res, next)

    } catch (error) {
      req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: "Error en el servidor",
            error: error.message
        })
    }
}

export const loginUser = async (req, res, next) => {
  try {
      passport.authenticate('login', (err, user) => {
          if (err) {
              return res.status(401).send({
                  message: `Error en login`,
                  error: err.message
              })
          }
          if (!user) {
              return res.status(401).send(`Credenciales incorrectas`)
          }
          req.session.login = true
          req.session.user = user

          req.logger.info("Login detectado")

          return res.status(200).send(`Bienvenido ${req.session.user.role} ${req.session.user.first_name}`)
      })(req, res, next)

  } catch (error) {
    req.logger.fatal("Error en el servidor")
      res.status(500).send({
          message: "Error en el servidor",
          error: error.message
      })
  }
}

export const destroySession = async (req, res) => {
  try {
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
  } catch(error) {
    req.logger.fatal("Error en el servidor")
    res.status(500).send({
      message: "Error en el servidor",
      error: error.message
    })
  }
};

export const getSession = async (req, res) => {
  try {
    if (req.session.login) {
        console.log(req.session.user)
        res.status(200).json(req.session.user);
    } else {
        return res.status(401).send(`No se encontró ninguna sesion activa`)
    }
} catch (error) {
  req.logger.fatal("Error en el servidor")
    res.status(500).send({
        message: "Error en el servidor",
        error: error.message
    })
}
};

export const sendResetPwdLink = async (req, res, next) => {
  const { email } = req.body;

  try {
      const user = await findUserByEmail(email);
      
      if (!user) {
          res.status(404).send({
              status: 'error',
              message: 'El usuario con este correo electrónico no existe',
          });
          return
      }

      const resetLink = await generatePwdResetLink(user, req, res)

      const recoveryEmailOpts = {
          from: process.env.MAIL_USER,
          to: email,
          subject: 'Enlace de restablecimiento de contraseña',
          html: `
          <p>Hola ${user.first_name},</p>
          <p>Haz click <a href="${resetLink}">aquí</a> para reestablecer tu contraseña:</p>
  
          <p>Si no solicitaste un cambio de contraseña, ignora este correo.</p>
          `
      }
      await transporter.sendMail(recoveryEmailOpts);

      
      req.logger.info(`Enlace de restablecimiento de contraseña enviado a ${email}`)
      res.status(200).send({
          status: 'success',
          message: `Enlace de restablecimiento de contraseña enviado a ${email}`
      })

  } catch (error) {
      req.logger.error(`Error en el procedimiento de restablecimiento de contraseña - ${error.message}`)
      res.status(500).send({
          status: 'error',
          message: error.message
      })
      next(error)
  }
}

async function generatePwdResetLink(user, req, res) {
  const token = await jwt.sign({ user_id: user._id }, process.env.SIGNED_COOKIE, { expiresIn: '1h' })
  req.logger.info(`Cookie de restablecimiento de contraseña generada: ${token}`)

  return `http://localhost:${process.env.PORT}/resetPassword`
}

export const resetPassword = async (req, res, next) => {
  const { password, confirmPassword, token } = req.body

  console.log(`El token es: ${token}`)
  if (!token) {
      res.status(401).send({
          status: 'error',
          message: 'Token expirado'
      })
      return
  }
  if (!password) {
      res.status(400).send({
          status: 'error',
          message: 'Ingrese una nueva contraseña'
      })
      return
  }

  try {
      const readToken = jwt.verify(token, process.env.SIGNED_COOKIE);
      const userID = readToken.user_id;
      const userFound = await findUserById(userID);
      console.log(`readToken es: ${JSON.stringify(readToken)}`)
      console.log(`UserID es: ${userID}`)
      console.log(`El user es: ${userFound}`)

      if (!userFound) {
          res.status(404).send({
              status: 'error',
              message: 'Usuario no encontrado'
          })
      }
      if (password !== confirmPassword) {
          res.status(400).send({
              status: 'error',
              message: 'Ambas contraseñas deben coincidir'
          })
          return
      }
      if (await validatePassword(password, userFound.password)) {
          res.status(400).send({
              status: 'error',
              message: 'Tu contraseña coincide con la anterior. Porfavor ingrese una nueva'
          })
          return
      }

      //If everything is correct, update the password.
      const newPassword = await createHash(password.toString());
      await updateUser(userFound._id, { password: newPassword, });
      res.status(200).send({
          status: 'success',
          message: 'Su contraseña fue cambiada con exito'
      })

  } catch (error) {
      res.status(500).send({
          message: 'Error en el cambio de la contraseña',
          error: error.message
      })
      next(error)        
  }
}