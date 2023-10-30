import passport from "passport";

import MyRouter from "./router.js";

import { MessageManagerDB } from "../dao/db/message_managerDB.js";
const messageManagerDB = new MessageManagerDB()



export default class ChatRouter extends MyRouter {
    init() {
        this.get('/', async ( req, res ) => { 
            try{
                const log = await messageManagerDB.readMessage()
                res.json({ status: 'success', payload: log })
            }catch( err ) {
                res.status(400).send({ status: "error", error: err });
            }
        })

        this.post('/', passport.authenticate('jwt', { failureRedirect: 'failChat' , session: false }), async ( req, res ) => { 
            console.log(req.user, 33)
            try{
                const { first_name } = req.user;
                console.log( first_name )
                const { message } = req.body;
                const data = {
                    first_name,
                    message,
                    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //? --> 1 Week to expires the log
                }
                await messageManagerDB.addMessage( data );
                res.json({ status: 'success', payload: data })
            }catch( err ) {
                res.status(400).send({ status: "error", error: err });
            }
        })

        this.get('/failChat', ( req, res ) => res.render('errors/errorAuth',{error: 'Fail chat'}))
    }
}
