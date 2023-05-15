import passport from "passport"

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) { //Errores del Token (token no valido, no posee el formato adecuado o no existe, etc)
                return next(error)
            }

            if (!user) {
                return res.status(401).send({
                    error: info.message ? info.message : info.toString()
                })
            }

            req.user = user
            next()
        }) (req, res, next)
    }
}

export const roleVerification = (role) => {
    return (req, res, next) => {
        if (req.session.login) {
            if (req.session.user.role !== role) {
                return res.status(401).send(`Accion no permitida para ${req.session.user.role}`)
            }
            next()

        } else {
            return res.status(401).send(`${req.session.user.role} no posee los permisos necesarios`)
        }
    }

}