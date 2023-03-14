import { Router } from "express";
import { ManagerMessageMongoDB } from "../dao/MongoDB/models/Message.js";

const routerSocket = Router()
// const selectedDB = process.env.DBSELECTION

const messageManager = new ManagerMessageMongoDB()

routerSocket.get("/", async (req, res) => {
    const messages = await messageManager.getElements(0)
    res.render("chat", {messages: messages})
})








export default routerSocket