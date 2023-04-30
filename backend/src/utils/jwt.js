import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.SIGNED_COOKIE, { expiresIn: '24h' })
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization    // JWT se guarda en el header el token

    // El token no existe o expiró
    if(!authHeader) {
        return res.status(401).send({
            error: "Usuario no autenticado"
        })
    }

    // Eliminar la palabra Bearer del token
    const token = authHeader.split(' ')[1]

    jwt.sign(token, process.env.SIGNED_COOKIE, (error, credentials) => {
        if(error) {
            return res.status(403).send({
                error: "Usuario no autorizado"
            })
        }
        
        // Token existe y es válido
        req.user = credentials.user
        next()
    })
}