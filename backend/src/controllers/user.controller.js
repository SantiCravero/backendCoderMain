import { findUsers } from "../services/userService.js";

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).json({users})

    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }
}