import { Router } from "express";
import { mockingProducts } from "../utils/mocking/mocking.controller.js";

const routerMocking = Router()

routerMocking.get("/", mockingProducts)

export default routerMocking