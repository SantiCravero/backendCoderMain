import { Router } from "express";

const routerChat = Router()
// const selectedDB = process.env.DBSELECTION

routerChat.get("/", async (req, res) => {
    res.render("chat", {})
})






export default routerChat