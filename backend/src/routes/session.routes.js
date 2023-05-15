import { Router } from "express";
import { destroySession, getSession, loginUser, registerUser } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post('/register', registerUser)
routerSession.post('/login', loginUser)

routerSession.get('/current', getSession)
routerSession.get('/logout', destroySession)

export default routerSession