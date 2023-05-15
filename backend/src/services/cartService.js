import cartModel from "../models/MongoDB/cartModel.js";

export const findCartById = async (id) => {
    try {
        return await cartModel.findById(id);
    } catch (error) {
        throw new Error(error);
    }
}

export const createCart = async () => {
    try {
        const newCart = await cartModel()
        await newCart.save()
        return newCart
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteCart = async (id) => {
    try {
        return await cartModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}

export const updateCart = async (id, info) => {
    try {
        return await cartModel.findByIdAndUpdate(id, info);
    } catch (error) {
        throw new Error(error);
    }
}

export const updateQuantityProduct = async (idCart, idProduct, newQuantity) => {
    try {
        const cart = await cartModel.findById(idCart)
        const indexProduct = cart.products.findIndex(product => product.productId == idProduct)
    
        if (indexProduct == -1) {
            throw new Error("El producto no existe en el carrito")
        } else {
            cart.products.splice(productIndex, 1)
            await cart.save()
            return true
        }
    } catch (error) {
        throw new Error(error)
    }
}