import { Router } from "express";
import { forgotPasswordView, sendLoginView, productView, sendRegisterView, sendResetPasswordView, cartView, profileView } from "../controllers/handlebars.controller.js";

const routerHandlebars = Router()

routerHandlebars.get("/login",sendLoginView)
routerHandlebars.get("/register",sendRegisterView)

routerHandlebars.get("/forgotPassword", forgotPasswordView)
routerHandlebars.get('/resetPassword', sendResetPasswordView)

routerHandlebars.get("/product", productView)
routerHandlebars.get("/cart", cartView)
routerHandlebars.get("/profile", profileView)

export default routerHandlebars