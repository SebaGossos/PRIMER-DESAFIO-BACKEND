import { Router } from "express";
import { Server } from 'socket.io'

const router = Router();


router.get('/', async (req, res) => { 

    res.render("chat", { 1:1 });
})


export default router;



