import { Router } from "express";
import { destroySession, getSession, testLogin } from "../controllers/session.controller.js";
import passport from "passport";

const routerSession = Router()

routerSession.post("/testLogin", passport.authenticate('login'), testLogin)
routerSession.get("/logout", destroySession)
routerSession.get("/getSession", getSession)

export default routerSession