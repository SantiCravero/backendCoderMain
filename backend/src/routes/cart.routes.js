import { Router } from "express";
import { addProductToCart, deleteAllProductsCart, deleteProductCart, getCart, updateProductsCart, updateProductQuantity, createNewTicket } from "../controllers/cart.controller.js";
import { roleVerification } from "../utils/errorMessages.js";

const routerCart = Router()

// routerCart.post("/", createCart)
routerCart.get("/", roleVerification("User"), getCart)
routerCart.post("/:cid/products/:pid", roleVerification("User"), addProductToCart)
routerCart.put("/:cid", roleVerification("User"), updateProductsCart)
routerCart.put("/:cid/products/:pid", roleVerification("User"), updateProductQuantity)
routerCart.delete("/:cid", roleVerification("User"), deleteAllProductsCart)
routerCart.delete("/:cid/products/:pid", roleVerification("User"), deleteProductCart)
routerCart.post("/purchase", roleVerification("User"), createNewTicket)

export default routerCart