import { Schema } from "mongoose"
import { ManagerMongoDB } from "../../../db/mongoDBManager.js"

const url = process.env.URLMONGODB

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    },
    idCart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    }
})

export class ManagerUserMongoDB extends ManagerMongoDB {
    constructor() {
        super(url, "users", userSchema)
    }

    async getUserByEmail(email) {
        super.setConection()

        try {
            return await this.model.findOne({ email: email })
        } catch (error) {
            return error
        }
    }
}