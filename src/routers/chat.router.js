import { Router } from "express";
import { MessageManagerDB } from "../dao/db/message_managerDB.js";

const router = Router();
const messageManagerDB = new MessageManagerDB()


router.get('/', async ( req, res ) => { 
    try{
        const log = await messageManagerDB.readMessage()
        res.json({ status: 'success', payload: log })
    }catch( err ) {
        res.status(400).send({ status: "error", error: err });
    }
})

router.post('/', async ( req, res ) => { 
    try{
        const message = req.body
        await messageManagerDB.addMessage( message );
        res.json({ status: 'success', payload: message })
    }catch( err ) {
        res.status(400).send({ status: "error", error: err });
    }
})



export default router;



