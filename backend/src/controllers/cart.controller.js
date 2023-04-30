import { findCartById, updateCart, updateQuantityProduct } from "../services/cartService.js";
import { findProductById } from "../services/productService.js";

export const getProductsCart = async (req, res) => {
  try {

    const products = await cartPopulate()

    if (products) {
        return res.status(200).json(products)
    } else {
        res.status(200).json({
            message: "Productos no encontrados"
        })
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProductToCart = async (req, res) => {
    const idCart = req.params.cid    // Carrito a donde va el producto a agregar
    const idProduct = req.params.pid  // Producto a agregar

    try {
        const realProduct = await findProductById(idProduct);

        if (realProduct) {
            const cart = await findCartById(idCart, idProduct);

            if (cart) {
                return res.status(200).json(cart);
            } else{
                res.status(200).json({
                    message: "Carrito no encontrado"
                });
            }
        }
        res.status(200).json({
            message: "Producto no existe"
        });
    } catch (error) {
        res.status(500).json({
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

        const cart = await updateQuantityProduct(idCart, idProduct, newQuantity)
        
        if (cart) {
            return res.status(200).json(cart);
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
            return res.status(200).json(cart);
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
        const cart = await findCartById(idCart, idProduct)

        if (cart) {
            return res.status(200).json({
                message: "Producto eliminado"
            });
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
