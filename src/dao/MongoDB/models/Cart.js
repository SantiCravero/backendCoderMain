import { Schema } from "mongoose";
import { ManagerMongoDB } from "../../../db/mongoDBManager.js";

const url = process.env.URLMONGODB

const cartSchema = new Schema({
    products:{
        type:[{
            productId:{
                type: Schema.Types.ObjectId,
                ref: "products",
            },
            quantity:{
                type:Number,
                default:1
            }
        }],
        default:[]
    }
})

export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor () {
        super(url, 'cart', cartSchema)
    }

    // async addProductCart(id, idProd, cant) {
    //     super.setConection()
    //     const carrito = await this.model.findById(id)
    //     carrito.products.push({ productId: idProd, quantity: cant })
    //     return carrito.save()
    // }

    async addProductToCart (idCart, idProduct) {
        super.setConection()

        const cart = await this.model.findById(idCart)
        const indexProduct = cart.products.findIndex(product => product.productId.equals(idProduct))

        if(indexProduct == -1) {
            cart.products.push({ productId: idProduct })
        } else {
            cart.products[indexProduct].quantity += 1
        }
        return await cart.save()
    }

    async updateQuantityProduct (idCart, idProduct, newQuantity) {
        super.setConection()

        const cart = await this.model.findById(idCart)
        const indexProduct = cart.products.findIndex(product => product.productId == idProduct)

        if (indexProduct == -1) {
            throw new Error("El producto no existe en el carrito")
        } else {
            cart.products[indexProduct].quantity += newQuantity
        }
        return await cart.save()
    }

    async updateProductsCart (idCart, product) {
        super.setConection()

        const cart = await this.model.findById(idCart)

        cart.products = product
        cart.save()
    }

    async deleteProductCart (idCart, idProduct) {
        super.setConection()

        const cart = await this.model.findById(idCart)
        const indexProduct = cart.products.findIndex(product => product.productId.equals(idProduct))

        if(indexProduct == -1) {
            throw new Error('El producto no existe en el carrito')
        } else {
            cart.products.splice(indexProduct, 1)
        }
        return await cart.save()
    }

    async deleteAllProductsCart (idCart) {
        super.setConection()

        const cart = await this.model.findById(idCart)

        cart.products = []
        return await cart.save()
    }

    async cartPopulate () {
        super.setConection()

        const prods = await this.model.find().populate("products.productId")
        return prods
    }
}