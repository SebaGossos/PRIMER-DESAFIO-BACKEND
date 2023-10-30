import mongoose from 'mongoose';

export default mongoose.model( 'messages' , new mongoose.Schema({
    // _id: false,
    first_name: String,
    message: String,
    expireAt: { type: Date, expires: '1w' }
}));