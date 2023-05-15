import chatModel from "../models/MongoDB/chatModel.js"

export const createMessage = async (message) => {
    try {
        const newMessage = await chatModel.create(message)
        return newMessage
    } catch (error) {
        throw new Error(error)
    }
}

export const readMessages = async () => {
    try {
        return await chatModel.find()
    } catch (error) {
        throw new Error(error)
    }
}