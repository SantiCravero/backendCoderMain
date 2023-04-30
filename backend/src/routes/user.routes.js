import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import passport from "passport";

const routerUser = Router()

//Ruta - Middleware - Controller
routerUser.post("/register", passport.authenticate('register'), getUsers)

export default routerUser