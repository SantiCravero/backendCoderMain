import { Router } from "express";
import { addProductToCart, deleteAllProductsCart, deleteProductCart, getProductsCart, updateProductsCart, updateQuantityProduct } from "../controllers/cart.controller.js";

const routerCart = Router()

// routerCart.post("/", createCart)
routerCart.get("/:cid", getProductsCart)
routerCart.post("/:cid/products/:pid", addProductToCart)
routerCart.put(":cid", updateProductsCart)
routerCart.put("/:cid/products/:pid", updateQuantityProduct)
routerCart.delete("/:cid", deleteAllProductsCart)
routerCart.delete("/:cid/products/:pid", deleteProductCart)

export default routerCart