import mongoose from "mongoose";
class Ticket {

    static get model() {
        return 'tickets'
    }

    static get schema() {
        const instanceMongo = new mongoose.Schema({
            code: { type: String, required: true, unique: true },
            products: {
                type: [{
                    _id: false,
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    },
                    price: Number,
                    quantity: Number
                }]
            },
            amount: { type: Number },
            purchaser: { type: String, ref: "users" }
        }, 
        {
            timestamps: {
                createdAt: 'purchase_datetime'
            }
        })

        return instanceMongo
    }
    
}
mongoose.set('strictQuery', false)
export const ticketModel = mongoose.model( Ticket.model, Ticket.schema );

