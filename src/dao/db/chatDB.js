import { chatModel } from "../../models/Chat.js";
export default class ChatMongo {
  
  getAll = async () => await chatModel.find().lean().exec();

  create = async ( data ) => await chatModel.create( data );

}
