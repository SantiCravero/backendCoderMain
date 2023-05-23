import productModel from "../models/MongoDB/productModel.js";
import { findCartById, updateCart } from "../services/cartService.js";
import { findProductById } from "../services/productService.js";
import { createTicket, returnLastCode } from "../services/ticketService.js";

export const getCart = async (req, res) => {
    const idCart = req.session.user.idCart;

    try {
        const cart = await findCartById(idCart);
        const cartPopulate = await cart.populate({ path: "products.productId", model: productModel })
        res.status(200).json({ cartPopulate });

    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        })
    }
}

export const addProductToCart = async (req, res) => {
    const idCart = req.params.cid    // Carrito a donde va el producto a agregar
    const idProduct = req.params.pid  // Producto a agregar

    try {
        const realProduct = await findProductById(idProduct);

        if (realProduct) {
            const cart = await findCartById(idCart);
            const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));
            if (productIndex === -1) {
                cart.products.push({ productId: idProduct });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await updateCart(idCart, cart);
            return res.status(200).send("Producto agregado al carrito con exito")
        }
        res.status(200).json({
            message: "Producto no existe"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            message: error.message
        });
    }
}


export const updateProductQuantity = async (req, res) => {

    const { quantity } = req.body;

    const idCart = req.params.cid
    const idProduct = req.params.pid
    const newQuantity = parseInt(quantity);

    try {
        const cart = await findCartById(idCart);
        const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));
        if (productIndex === -1) {
            throw new Error('El producto no existe en el carrito.');
        }
        cart.products[productIndex].quantity = newQuantity;
        await updateCart(idCart, cart);
        return res.status(200).send("Cantidad del producto actualizada")

    } catch (error) {
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
        res.status(500).json({
            message: error.message,
        });
    }
}

export const deleteProductCart = async (req, res) => {
    const idCart = req.params.cid
    const idProduct = req.params.pid

    try {
        const cart = await findCartById(idCart);
        const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

        if (productIndex === -1) {
            throw new Error('El producto no existe en el carrito.');
        }

        cart.products.splice(productIndex, 1);
        await updateCart(idCart, cart);
        return res.status(200).send("El producto ha sido eliminado del carrito")

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const createNewTicket = async (req, res) => {

    const cart = await findCartById(req.session.user.idCart)

    if (cart.products.length > 0) {

      let amount = 0;
      let productosSinStock = [];

      for (const cartProduct of cart.products) {

        const productosDatabase = await findProductById(cartProduct.productId);

        if (productosDatabase) {
          if (productosDatabase.stock > cartProduct.quantity) {

            amount += cartProduct.quantity;
            productosDatabase.stock -= cartProduct.quantity;
            await productosDatabase.save();
          } else {
            productosSinStock.push(cartProduct.productId);
          }
        } else {
          const productosSinProcesar = cart.products;
          cart.products = [];
          await cart.save();

          return res.status(404).send({
            message:
              "El producto que está en el carrito no existe, su carrito se vació",
            productosSinProcesar: productosSinProcesar,
          });
        }
      }
      const lastCode = await returnLastCode();
      const nextCode = lastCode ? lastCode.code + 1 : 1;

      const ticket = await createTicket({
        code: nextCode,
        amount: amount,
        purchase_dateTime: new Date(),
        purchaser: req.session.user.email,
      });

      cart.products = [];
      await cart.save();
      
      if (productosSinStock.length > 0) {
        return res.status(200).send({
          message:
            "Compra exitosa, algunos productos no se agregaron debido a stock insuficiente",
          ticket: ticket,
          productosSinStock: productosSinStock,
        });
      } else {
        return res.status(200).send({
          message: "Ticket generado, se vació el carrito",
          ticket: ticket,
        });
      }
    } else {
      return res.status(404).send("El carrito está vacio");
    }
}
