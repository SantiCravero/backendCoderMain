import { Router } from "express";
import { addProductToCart, deleteAllProductsCart, deleteProductCart, getCart, updateProductsCart, updateProductQuantity } from "../controllers/cart.controller.js";
import { roleVerification } from "../utils/errorMessages.js";
import { createTicketAndSave } from "../controllers/ticket.controller.js";

const routerCart = Router()

// routerCart.post("/", createCart)
routerCart.get("/", roleVerification("User"), getCart)
routerCart.put("/", roleVerification("User"), updateProductsCart)
routerCart.post("/product/:pid", roleVerification("User"), addProductToCart)
routerCart.put("/product/:pid", roleVerification("User"), updateProductQuantity)
routerCart.delete("/", roleVerification("User"), deleteAllProductsCart)
routerCart.delete("/product/:pid", roleVerification("User"), deleteProductCart)
routerCart.post("/purchase", roleVerification("User"), createTicketAndSave)

export default routerCart