import mongoose from 'mongoose';

export default mongoose.model( 'messages' , new mongoose.Schema({
    user: String,
    message: String
}) );