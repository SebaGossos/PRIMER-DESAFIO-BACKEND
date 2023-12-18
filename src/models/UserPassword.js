import mongoose from "mongoose";

export default class UserPassword {

    static get model() {
        return 'userPassword';
    }

    static get schema() {
        return new mongoose.Schema({
            email: { type: String, ref: 'users' },
            token: { type: String, require: true },
            isUsed: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now, expireAfterSeconds: 3600 }
        })
    }
}

mongoose.set( 'strictQuery', false )

export const UserPasswordModel = mongoose.model( UserPassword.model, UserPassword.schema )