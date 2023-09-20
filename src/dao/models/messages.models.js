import mongoose from 'mongoose';

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
})

const cartsModels = mongoose.model( messagesCollection, messageSchema );
export default cartsModels;