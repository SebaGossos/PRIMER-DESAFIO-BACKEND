import messagesModels from "../models/messages.models";
export class MessageManagerDB {

    readMessage = async() => await messagesModels.find().lean().exec();

    addMessage = async( message ) => await messagesModels.create( message )

}