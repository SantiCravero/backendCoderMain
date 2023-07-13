import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import { mensajeMulter, upload } from "../config/multer.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerUser = Router()

routerUser.get("/", roleVerification("User"), getUsers)
routerUser.post("/documents", upload.single('document'), mensajeMulter)

export default routerUser