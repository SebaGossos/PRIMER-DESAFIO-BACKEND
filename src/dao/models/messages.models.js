import mongoose from 'mongoose';

export default mongoose.model( 'messages' , new mongoose.Schema({
    // _id: false,
    user: String,
    message: String
}));