import { Router } from "express";
import { MessageManagerDB } from "../dao/db/message_managerDB.js";

const router = Router();
const messageManagerDB = new MessageManagerDB()


router.get('/', async (req, res) => { 
    try{
        const log = await messageManagerDB.readMessage()
        console.log( log )
        res.json({ payload: log })
    }catch( err ) {
        console.log( err )
    }
})

router.post('/', async (req, res) => { 
    try{
        const message = req.body
        console.log( message )
        await messageManagerDB.addMessage( message );
        res.json({ payload: message })
    }catch( err ) {
        console.log( err )
    }
})



export default router;



