import { Router } from "express";
import { addProductToCart, deleteAllProductsCart, deleteProductCart, getCart, updateProductsCart, updateProductQuantity, createNewTicket } from "../controllers/cart.controller.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerCart = Router()

// routerCart.post("/", createCart)
routerCart.get("/", roleVerification("Usuario"), getCart)
routerCart.post("/:cid/products/:pid", roleVerification("Usuario"), addProductToCart)
routerCart.put("/:cid", roleVerification("Usuario"), updateProductsCart)
routerCart.put("/:cid/products/:pid", roleVerification("Usuario"), updateProductQuantity)
routerCart.delete("/:cid", roleVerification("Usuario"), deleteAllProductsCart)
routerCart.delete("/:cid/products/:pid", roleVerification("Usuario"), deleteProductCart)
routerCart.post("/purchase", roleVerification("Usuario"), createNewTicket)

export default routerCart