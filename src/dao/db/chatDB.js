import chatModels from "../models/chat.models.js";
export default class ChatMongo {
  getAll = async () => await chatModels.find().lean().exec();

  create = async ( data ) => await chatModels.create( data );

}
