import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

class Product {

    static get model() {
        return 'products'
    }

    static get schema() {
        const instanceMongo = new mongoose.Schema({
            title: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            code: { type: String, required: true, unique: true, active:true },
            stock: { type: Number, required: true },
            category: { type: String, required: true },
            status: { type: Boolean, required: true },
            thumbnail: { type: [String], required: true }
        })
        instanceMongo.plugin( mongoosePaginate )
        return instanceMongo
    }
}

export const productModel = mongoose.model( Product.model, Product.schema );