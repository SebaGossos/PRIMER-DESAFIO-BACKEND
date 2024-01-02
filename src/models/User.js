import mongoose from "mongoose";
export default class User {

    static get model() {
        return 'users'
    }

    static get schema() {
        const instanceMongo = new mongoose.Schema({
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            email: { type: String, unique: true, required: true },
            age: { type: Number, required: true },
            password: { type: String, required: true },
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            },
            role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
            source: String
        })

        return instanceMongo
    }
    
}
mongoose.set('strictQuery', false)
export const userModel = mongoose.model( User.model, User.schema );
// class User {

//     static get model() {
//         return 'users'
//     }

//     static get schema() {
//         const instanceMongo = new mongoose.Schema({
//             first_name: { type: String, required: true },
//             last_name: { type: String, required: true },
//             email: { type: String, unique: true, required: true },
//             age: { type: Number, required: true },
//             password: { type: String, required: true },
//             cart: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'carts'
//             },
//             role: { type: String, default: 'user' },
//             source: String
//         })

//         return instanceMongo
//     }
    
// }
// mongoose.set('strictQuery', false)
// export const userModel = mongoose.model( User.model, User.schema );

