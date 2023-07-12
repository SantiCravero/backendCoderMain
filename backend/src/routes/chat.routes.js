import { Router } from "express"
import { getMessages, sendMessage } from "../controllers/chat.controller.js"
import { roleVerification } from "../utils/errorMessages.js"

const routerChat = Router()

routerChat.get("/", async (req, res) => {
    res.render("chat")
})

routerChat.get('/', getMessages)
routerChat.post('/', roleVerification("User"), sendMessage)

export default routerChat