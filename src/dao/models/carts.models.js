import mongoose from 'mongoose';

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: Number,
    products:[{
        id: Number,
        quantity: Number
    }]
})

const cartsModels = mongoose.model( cartsCollection, cartSchema );
export default cartsModels;