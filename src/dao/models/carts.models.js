import mongoose from 'mongoose';

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
    // products:[{
    //     id:{
    //         type:[
                
    //         ]
    //     },
    //     quantity: Number
    // }]
    products:{
        // _id:false,
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

const cartsModels = mongoose.model( cartsCollection, cartSchema );
export default cartsModels;