import productModel from "../models/MongoDB/productModel.js";
import { findCartById, updateCart } from "../services/cartService.js";
import { findProductById } from "../services/productService.js";
import { createTicket, returnLastCode } from "../services/ticketService.js";
import jwt from "jsonwebtoken"
import { generateAddProductToCartErrorInfo } from "../utils/errors/info.js";
// import { sendEmail } from "../utils/email.js";

export const getCart = async (req, res) => {
    const cookie = req.cookies['userCookie']
    if (!cookie) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
    const idCart = loguedUser.idCart;
    try {
        const cart = await findCartById(idCart);
        if (!cart) {
            throw new Error(`El carrito no existe`);
        }
        const cartPopulate = await cart.populate({ path: "products.productId", model: productModel })
        return res.status(200).json({
            message: "Carrito devuelto correctamente",
            cart: cartPopulate
        });
    } catch (error) {
        req.logger.fatal("Fatal error/Server connection")
        return res.status(500).json({
            message: "Hubo un error en el servidor",
            error: error.message
        })
    }
}

export const addProductToCart = async (req, res) => {
    const cookie = req.cookies['userCookie']
    if (!cookie) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
    const idCart = loguedUser.idCart;
    const idProduct = req.params.pid;

    const productoExiste = await findProductById(idProduct)
    try {
        // Verifica que haya un producto para agregar
        if (!productoExiste) {
            throw CustomError.createError({
                name: "Error al agregar un producto",
                message: "Producto no existente",
                cause: generateAddProductToCartErrorInfo(idProduct),
                code: ErrorEnum.MISSING_FIELDS
            });
        } else {
            try {
                const realProduct = await findProductById(idProduct);
                if (realProduct) {
                    const cart = await findCartById(idCart);
                    const productIndex = cart.products.findIndex(product => product.productId == idProduct);
                    if (productIndex === -1) {
                        cart.products.push({ productId: idProduct });
                    } else {
                        if (cart.products[productIndex].quantity+1 > realProduct.stock){
                            return res.status(400).json({message:"Stock insuficiente"})
                        }
                        cart.products[productIndex].quantity += 1; 
                    }

                    await cart.save();
                    req.logger.info("El producto", idProduct, "ha sido agregado al carrito")
                    return res.status(200).json({
                        message: "Producto agregado al carrito",
                        cart: await cart.populate({ path: "products.productId", model: productModel })

                    })
                }

            } catch (error) {
                req.logger.fatal("Error en el servidor")
                return res.status(500).json({
                    message: "Error en el servidor",
                    error: error.message
                })
            }
        }
    } catch (error) {
        next(error);
    }
}

export const updateProductQuantity = async (req, res) => {
    const { quantity } = req.body;
    const cookie = req.cookies['userCookie']
    if (!cookie) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
    const idCart = loguedUser.idCart;

    const idProduct = req.params.pid;
    const newQuantity = parseInt(quantity);

    try {
        const cart = await findCartById(idCart);
        const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

        if (productIndex === -1) {
            throw new Error('El producto no existe en el carrito.');
        }
        const dbProduct = await productModel.findById(idProduct)
        if (newQuantity < 1 ) {
            return res.status(400).json({ message: "Debes tener un producto como mínimo" })
        }
        if (dbProduct.stock < newQuantity) {
            return res.status(400).json({ message: "No hay mas stock" })
        }

        cart.products[productIndex].quantity = newQuantity;
        await cart.save();
        return res.status(200).json({
            message: "Cantidad del producto actualizada",
            cart: await cart.populate({ path: "products.productId", model: productModel })
        })

    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: "Error en el servidor",
            error: error.message
        })
    }
}

export const updateProductsCart = async (req, res) => {
    const idCart = req.params.cid
    const info = req.body

    try {
        const products = await updateCart(idCart, info)

        if (products) {
            return res.status(200).json({
                message: "Productos actualizados"
            })
        } else {
            res.status(200).json({
                message: "Productos no encontrados"
            })
        }
    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).json({
            message: "Error en el servidor",
            message: error.message
        })
    }

}

export const deleteAllProductsCart = async (req, res) => {
    const idCart = req.params.cid
    const info = { products : [] }

    try {
        const cart = await updateCart(idCart, info)

        if (cart) {
            return res.status(200).send("Productos eliminados con exito")
        }

        res.status(200).json({
            message: "Carrito no encontrado"
        });

    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).json({
            message: error.message,
        });
    }
}

export const deleteProductCart = async (req, res) => {
    const cookie = req.cookies['userCookie']
    if (!cookie) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    const loguedUser = jwt.verify(cookie, process.env.SIGNED_COOKIE).user;
    const idCart = loguedUser.idCart;
    const idProduct = req.params.pid;
    try {
        const cart = await findCartById(idCart);
        const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        await cart.save();
        return res.status(200).json({
            message: "El producto ha sido eliminado del carrito",
            cart: await cart.populate({ path: "products.productId", model: productModel })
        })


    } catch (error) {
        req.logger.fatal("Error en el servidor")
        res.status(500).send({
            message: "Error en el servidor",
            error: error.message
        })
    }
}
