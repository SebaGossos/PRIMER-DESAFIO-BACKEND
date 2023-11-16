import messagesModels from "../models/chat.models.js";
export class MessageManagerDB {
  readMessage = async () => await messagesModels.find().lean().exec();

  addMessage = async (data) => await messagesModels.create(data);
}
