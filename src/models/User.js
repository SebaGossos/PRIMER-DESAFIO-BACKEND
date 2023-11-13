import mongoose from "mongoose";

export default class User {

    static get model() {
        return 'users'
    }

    static get schema() {
        return {
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
        }
    }
    
}

