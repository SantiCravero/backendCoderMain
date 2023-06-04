import { io } from "../index.js"
import { createMessage, readMessages } from "../services/chatService.js"

export const getMessages = async (req, res) => {
    try {
        const messages = await readMessages()
        console.log(`Mensajes actualizados`)

        res.status(200).json({
            messages: messages
        })
    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: `Error en el servidor`,
            error: error.message
        })

    }
}

export const sendMessage = async (req, res) => {
    const { message } = req.body
    const { first_name, last_name, email } = req.session.user

    try {
        const sentMessage = await createMessage({
            name: `${first_name} ${last_name}`,
            email,
            message
        })
        const messages = await readMessages()
        io.emit("message", messages)

        res.status(200).send({
            message: `Mensaje enviado`,
            payload: sentMessage.message
        })

    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: `Error en el servidor`,
            error: error.message
        })
    }
}