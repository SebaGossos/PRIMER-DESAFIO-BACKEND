import config from "../../config/config.js";

export let Ticket

const persistance = config.persistance.toUpperCase();

if ( persistance === 'MONGO' ) {
    const { default: TicketMongo } = await import('../db/ticketDB.js')
    Ticket = TicketMongo;
}

if ( persistance === 'FILE' ) {
    const { default: TicketFile } = await import('../fs/ticketFS.js')
    Ticket = TicketFile;
}