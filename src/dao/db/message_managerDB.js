import messagesModels from "../models/messages.models.js";
export class MessageManagerDB {

    readMessage = async() => await messagesModels.find().lean().exec();

    addMessage = async( message ) =>{


        
        return await messagesModels.create( message );
    }

}