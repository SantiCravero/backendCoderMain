import { Router } from "express";
import { destroySession, getSession, loginUser, registerUser, resetPassword, sendResetPwdLink } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post('/register', registerUser)
routerSession.post('/login', loginUser)
routerSession.get('/current', getSession)
routerSession.get('/logout', destroySession)

routerSession.post('/password/createlink', sendResetPwdLink)
routerSession.post('/password/reset', resetPassword)

export default routerSession