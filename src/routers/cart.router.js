import { Router } from 'express';
import { ProductManager } from '../products_manager.js';
import { Carts_manager } from '../carts_manager.js';

const cartManager = new Carts_manager('./data/carts.json')

const router = Router()

router.post('/', async(req, res) => {
    try{
        const hola = await cartManager.createCart()
        res.json({ success: hola })
    }catch(err){
        res.status(400).send({ error: err })
    }
})

router.get('/:cid', async(req, res) => {
    const id = +req.params.cid;
    try{
        // const hola = await cartManager.addToCart(3)
        // res.json({ success: hola })
    }catch(err){
        res.status(400).send({ error: err })
    }
})


export default router 