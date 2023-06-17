import { Router } from "express";
import { forgotPasswordView, sendLoginView, sendRegisterView, sendResetPasswordView } from "../controllers/handlebars.controller.js";

const routerHandlebars = Router()

routerHandlebars.get("/login",sendLoginView)
routerHandlebars.get("/register",sendRegisterView)

routerHandlebars.get("/forgotPassword", forgotPasswordView)
routerHandlebars.get('/resetPassword', sendResetPasswordView)


export default routerHandlebars