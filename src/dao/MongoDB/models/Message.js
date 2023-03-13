import { Schema } from "mongoose";
import { ManagerMongoDB } from "../../../db/ManagerMongoDB";

const url = process.env.URLMONGODB

const messageSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    message: String
})

export class ManagerMessageMongoDB extends ManagerMongoDB {
    constructor () {
        super(url, "messages", messageSchema)
        // Aqui irian los atributos propios de la clase
    }
    // Aqui irian los metodos propios de la clase
}