import passport from "passport";

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

          console.log(`Login detectado`)

          return res.status(200).send(`Bienvenido ${req.session.user.role} ${req.session.user.first_name}`)
      })(req, res, next)
  } catch (error) {
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
    res.status(500).send({
        message: "Error en el servidor",
        error: error.message
    })
}
};
