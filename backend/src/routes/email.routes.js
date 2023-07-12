import { Router } from "express";
import { roleVerification } from "../utils/errorMessages.js";
import { sendEmail } from "../utils/email.js";

const routerEmail = Router()

routerEmail.get("/", roleVerification("Admin", "User"), sendEmail)

export default routerEmail