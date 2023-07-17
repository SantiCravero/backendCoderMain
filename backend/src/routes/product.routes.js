import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerProduct = Router()

routerProduct.get("/", getProducts)
routerProduct.get("/:pid", getProduct)
routerProduct.post("/", roleVerification("Admin"), createProduct)
routerProduct.put("/:pid", roleVerification("Admin"), updateProduct)
routerProduct.delete("/:pid", roleVerification("Admin"), deleteProduct)

export default routerProduct