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

// async function generatePwdResetLink(user, req, res) {
//   const token = await jwt.sign({ user_id: user._id }, process.env.SIGNED_COOKIE, { expiresIn: '1h' })
//   req.logger.info(`Cookie de restablecimiento de contraseña generada: ${token}`)

//   return `http://localhost:${process.env.PORT}/resetPassword`
// }

export const resetPassword = async (req, res, next) => {
    const email = req.signedCookies.tokenEmail
    if (!email) {
        return res.status(404).send({ message: 'Email not found or password reset link expired, redirecting' })
    }
    const { password, confirmPassword } = req.body
    console.log(email)
    try {
        const browserCookie = req.signedCookies.resetToken
        console.log(browserCookie)
        const user = await findUserByEmail(email)


        //Está este control pero no es necesario ya que reviso antes que el usuario exista, por un caso muy raro como si lo borraran en ese tiempo entre que pidió el link y hizo el recovery
        if (!user) {
            return res.status(404).send({ message: 'Email not found, redirecting' })
        }

        if (!browserCookie || isTokenExpired(browserCookie, user.resetToken)) {
            return res.status(401).send({ message: 'Password reset link expired' })
        }

        if (user.resetToken.token !== browserCookie) {
            return res.status(401).send({ message: 'Unauthorized action' })
        }

        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Both password fields must match' })
        }

        if (await validatePassword(password, user.password)) {
            return res.status(400).send({ message: 'New password must be different from the current one' })
        }

        // * Requirements passed, now we change the password
        const newPassword = await createHash(password.toString())
        await updateUser(user._id, {
            password: newPassword,
            resetToken: { token: '1h' }
        })
        res.status(200).send({ message: 'Password updated. Redirecting to login.' })

    } catch (error) {
        res.status(500).send({
            message: 'Error on password reset',
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
    //Generamos un email que dure lo mismo que el token para no tener que pedirselo al usuario
    res.cookie('tokenEmail', user.email, {
        signed: true,
        maxAge: 1000 * 60 * 60
    })
    const link = `http://localhost:5000/resetPassword`
    return link
}
  
  // TODO: aplicar testeo de timestamp en receivedCookie
  function isTokenExpired(receivedCookie, storedToken) {
    const elapsedTime = Date.now() - storedToken.createdAt
    const expirationTime = 1000 * 60 * 60
    return elapsedTime >= expirationTime
  }