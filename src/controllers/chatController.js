// import { MessageManagerDB } from "../dao/db/message_managerDB.js";
// const messageManagerDB = new MessageManagerDB()

import { ChatService } from "../repositories/index.js";
import ChatDTO from "../dto/chat.dto.js";

export default class ChatController {
    async getAll( req, res ) { 
        try{

            const user = req.user.email;
            const log = await ChatService.getAll()
            let data = []
            for ( let i of log ) {
                data.push( new ChatDTO( i ) )
            }

            res.json({ status: 'success', payload: { log: data, currentUser: user} })
        }catch( err ) {
            res.status(400).send({ status: "error", error: err });
        }
    }

    async create( req, res ) { 
        try{
            const { email } = req.user;

            const { message } = req.body;
            const data = {
                user: email,
                message,
                expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //? --> 1 Week to expires the log
            }
            const {expireAt, ...rest } = data 

            await ChatService.create( data );
            res.json({ status: 'success', payload: rest })
        }catch( err ) {
            res.status(400).send({ status: "error", error: err });
        }
    }


    failChat = ( req, res ) => res.render('errors/errorAuth',{error: 'Fail chat'})

}

