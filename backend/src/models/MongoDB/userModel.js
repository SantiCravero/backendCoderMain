import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        index: true,
        required: true
    },
    role:{
        type: String,
        default: "Usuario"
    },
    password:{
        type: String,
        required: true
    },
    idCart: {
        type: Schema.Types.ObjectId,
        ref: "Carts",
        required: true
    },
    resetToken: {
        token: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }  
})

const userModel = model("Users", userSchema);

export default userModel