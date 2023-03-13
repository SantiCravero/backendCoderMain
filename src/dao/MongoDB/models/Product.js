import { Schema } from "mongoose";
import { ManagerMongoDB } from "../../../db/ManagerMongoDB";

const url = ""

const productSchema = new Schema({
    name: String,
    price: Number,
    email: {
        type: String,
        unique: true
    },
    product: String
})

export class ManagerProductMongoDB extends ManagerMongoDB {
    constructor () {
        super(url, "products", productSchema)
    }
}