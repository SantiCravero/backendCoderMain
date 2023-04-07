import { Router } from "express";
import passport from "passport";
import { destroySession, getSession, testLogin } from "../controllers/session.controller.js";
import { passportError, roleVerification } from "../utils/errorMessages.js";

const routerSession = Router()

routerSession.post("/login", passport.authenticate('login'), testLogin)
routerSession.get("/logout", destroySession)
routerSession.get("/getSession", getSession)
routerSession.get("/testJWT", passport.authenticate('jwt', {session: false}, (req, res) => {
    res.send({"message" : "tokenJWT"})
}))
routerSession.get("/current", passportError('jwt'), roleVerification('User'), (req, res) => {
    res.send(req.user)
})

export default routerSession