import { Router } from 'express';

const router = Router()

const carts = []

// router.get('/', (req, res) => res.json(carts)) //? NOSE SI TIENE QUE EXISTIR

router.post('/', (req, res) => {
    const cart = req.body
    const id = carts.length === 0 ? 1 : carts[carts.length-1].id + 1;
    cart.id = id;
    carts.push( cart )
})


export default router