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
      passport.authenticate('login', async (err, user) => {
          if (err) {
              return res.status(401).send({
                  message: `Error en login`,
                  error: err.message
              })
          }
          if (!user) {
              return res.status(401).send(`Credenciales incorrectas`)
          }
          const token = jwt.sign({ user }, process.env.SIGNED_COOKIE, { expiresIn: "1h" });
            user.lastConnection = Date.now();
            await user.save();
            res.cookie('userCookie', token, { maxAge: 3600000 }).send({
                status: "success",
                message: "Inicio de sesion exitoso"
            });
        })(req, res, next);

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
        const cookie = req.cookies['userCookie'];
        if (cookie) {
            const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
            console.log(loguedUser)
            const user = await findUserById(loguedUser._id)
            user.lastConnection = Date.now()
            await user.save()
            res.clearCookie('userCookie');
            res.status(200).json({ message: "Hasta la proxima." });
        } else {
            res.status(404).json({ message: "Sesion no encontrada." });
        }
    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const getSession = async (req, res) => {
    const cookie = req.cookies['userCookie']
    if (!cookie) {
        req.logger.fatal("Usuario no encontrado")
        return res.status(401).json({ error: "Usuario no encontrado" })
    }
    const user = jwt.verify(cookie, process.env.SIGNED_COOKIE);
    console.log(user)
    try {
        if (user) {
            return res.status(200).json({
                message: "success",
                ...user
            });
        } else {
            return res.status(404).json({
                message: "Error, no existe session activa"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error: error
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

      const resetLink = await generatePasswordResetLink(user, req, res)

      const recoveryEmailOpts = {
          from: process.env.MAILER_USER,
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

export const resetPassword = async (req, res, next) => {
    const email = req.signedCookies.tokenEmail
    if (!email) {
        return res.status(404).send({ message: 'Correo electrónico no encontrado o enlace de restablecimiento de contraseña caducado.' })
    }
    const { password, confirmPassword } = req.body
    console.log(email)
    try {
        const browserCookie = req.signedCookies.resetToken
        console.log(browserCookie)
        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(404).send({ message: 'Email no encontrado.' })
        }

        if (!browserCookie || isTokenExpired(browserCookie, user.resetToken)) {
            return res.status(401).send({ message: 'Enlace de restablecimiento de contraseña caducado.' })
        }

        if (user.resetToken.token !== browserCookie) {
            return res.status(401).send({ message: 'Acción no autorizada' })
        }

        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Ambas contraseñas deben coincidir.' })
        }

        if (await validatePassword(password, user.password)) {
            return res.status(400).send({ message: 'La nueva contraseña debe ser diferente a la actual.' })
        }

        // * Requirements passed, now we change the password
        const newPassword = await createHash(password.toString())
        await updateUser(user._id, {
            password: newPassword,
            resetToken: { token: '1h' }
        })
        res.status(200).send({ message: 'Contraseña actualizada con exito.' })

    } catch (error) {
        res.status(500).send({
            message: 'Error en el restablecimiento de contraseña',
            error: error.message
        })
    }
}
  
async function generatePasswordResetLink(user, req, res) {
    const token = crypto.randomBytes(20).toString('hex')

    await updateUser(user._id, {
        resetToken: {
            token: token,
            createdAt: Date.now()
        }
    })

    res.cookie('resetToken', token, {
        signed: true,
        maxAge: 1000 * 60 * 60
    })
    res.cookie('tokenEmail', user.email, {
        signed: true,
        maxAge: 1000 * 60 * 60
    })
    const link = `http://localhost:5000/resetPassword`
    return link
}
  
function isTokenExpired(receivedCookie, storedToken) {
    const elapsedTime = Date.now() - storedToken.createdAt
    const expirationTime = 1000 * 60 * 60
    return elapsedTime >= expirationTime
  }