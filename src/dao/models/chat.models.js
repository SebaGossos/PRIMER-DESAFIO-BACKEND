import mongoose from 'mongoose';

mongoose.set('strictQuery', false)

export default mongoose.model( 'chats' , new mongoose.Schema({
    // _id: false,
    user: String,
    message: String,
    expireAt: { type: Date, expires: '1w' }
}));