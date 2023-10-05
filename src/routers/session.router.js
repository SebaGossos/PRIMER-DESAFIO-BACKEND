import { Router } from "express";


const router = Router();

router.post('/login', ( req, res ) => {
    //Todo
    const user = req.body
    res.send('hola estoy en login :)')
})

router.post('/register', ( req, res ) => {
    //Todo

    const user = req.body
    res.send('hola estoy en register :)')
})



export default router; 