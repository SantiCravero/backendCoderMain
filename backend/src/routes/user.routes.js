import { Router } from "express";
import { deleteInactiveUsers, getUsers, addDocs } from "../controllers/user.controller.js";
import { upload } from "../config/multer.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerUser = Router()

routerUser.get("/", roleVerification("User"), getUsers)
routerUser.post("/:uid/documents", upload.single('file'), addDocs)
routerUser.delete('/', roleVerification("Admin"), deleteInactiveUsers)

export default routerUser