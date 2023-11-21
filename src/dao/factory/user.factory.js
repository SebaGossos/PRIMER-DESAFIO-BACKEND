import config from "../../config/config.js";

export let User

const persistance = config.persistance.toUpperCase();

if ( persistance === 'MONGO' ) {
    const { default: UserMongo } = await import('../db/userDB.js')
    User = UserMongo;
}

if ( persistance === 'FILE' ) {
    const { default: UserFile } = await import('../fs/userFS.js')
    User = UserFile;
}