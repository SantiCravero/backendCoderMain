import { Schema } from "mongoose";
import { ManagerMongoDB } from "../../../db/mongoDBManager.js";

const url = process.env.URLMONGODB

const cartSchema = new Schema({
    products: {
        type: [{
            productId: {
                
            }
        }],
    }
})

export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor () {
        super(url, 'cart', cartSchema)
    }
}