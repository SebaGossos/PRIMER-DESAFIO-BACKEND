import config from "../../config/config.js";

export let Chat

const persistance = config.persistance.toUpperCase();

if ( persistance === 'MONGO' ) {
    const { default: ChatMongo } = await import('../db/chatDB.js')
    Chat = ChatMongo;
}

if ( persistance === 'FILE' ) {
    const { default: ChatFile } = await import('../fs/chatFS.js')
    Chat = ChatFile;
}