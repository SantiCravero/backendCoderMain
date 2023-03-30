import { Router } from "express";
import { destroySession, getSession, testLogin } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post("/testLogin", testLogin)
routerSession.get("/logout", destroySession)
routerSession.get("/getSession", getSession)

export default routerSession