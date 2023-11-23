import mongoose from "mongoose";
class Chat {

    static get model() {
        return 'chats'
    }

    static get schema() {
        const instanceMongo = new mongoose.Schema({
            user: String,
            message: String,
            expireAt: { type: Date, expires: '1w' }
        })
        return instanceMongo
    }
    
}
mongoose.set('strictQuery', false)
export const chatModel = mongoose.model( Chat.model, Chat.schema );