import { Router } from "express";
import { getManagerMessage } from "../dao/daoManager.js";
import { ManagerMessageMongoDB } from "../dao/MongoDB/models/Message.js";

const routerSocket = Router()
// const selectedDB = process.env.DBSELECTION

const messageManager = new ManagerMessageMongoDB

routerSocket.get("/", async (req, res) => {
    console.log("funciona")
    const messages = await messageManager.getElements(0)
    res.render("chat", {messages: messages})
})














export default routerSocket