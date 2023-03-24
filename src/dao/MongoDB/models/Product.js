import { Schema } from "mongoose";
import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import paginate from "mongoose-paginate-v2";

const url = process.env.URLMONGODB

const productSchema = new Schema({
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String,
        unique: true,
        required: true,
    },
    price: { 
        type: Number, 
        required: true,
        index: true
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        index: true
    },
    thumbnails: {
        type: Array, 
        default: ["/img/reloj.png"]
    }
})

productSchema.plugin(paginate)

export class ManagerProductMongoDB extends ManagerMongoDB {
    constructor () {
        super(url, "products", productSchema)
    }

    async getProducts(limit, page, filter, ord) {
        super.setConection()

        const products = await this.model.paginate({ filter: filter }, { limit: limit, page: page, sort: { price: ord } })
        return products
    }
}