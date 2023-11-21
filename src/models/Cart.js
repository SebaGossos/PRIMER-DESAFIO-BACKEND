import mongoose from "mongoose";
class Cart {

    static get model() {
        return 'carts'
    }

    static get schema() {

        const instanceMongo = new mongoose.Schema({
            products:{
                type:[{
                    _id:false,
                    pId:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }]
            }
        })

        return instanceMongo
    }
    
}
export const cartModel = mongoose.model( Cart.model, Cart.schema );