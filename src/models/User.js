import mongoose from "mongoose";
class User {

    static get model() {
        return 'users'
    }

    static get schema() {
        const instanceMongo = new mongoose.Schema({
            first_name: String,
            last_name: String,
            email: {type:String, unique: true},
            age: Number,
            password: String,
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            },
            role: { type: String, default: 'user' },
            source: String
        })

        return instanceMongo
    }
    
}
export const userModel = mongoose.model( User.model, User.schema );

