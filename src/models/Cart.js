import mongoose from "mongoose";
class Cart {

    static get model() {
        return 'carts'
    }

    static get schema() {

        const instanceMongo = new mongoose.Schema({
            userEmail: {
                type: String,
                require: true, 
                unique: true
            },
            products:{
                type:[{
                    _id:false,
                    pId:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }],
                default: []
            }
        })

        return instanceMongo
    }
    
}
mongoose.set('strictQuery', false)
export const cartModel = mongoose.model( Cart.model, Cart.schema );