import { Router } from 'express'
import { ProductManager } from '../products_manager.js'

const productManager = new ProductManager('./data/products.json')

// async function test(){
//     const products = await productManager.getProducts()
//     console.log( products )
// }
// test()

const router = Router()

router.get('/', async(req, res) => {
    try{
        const result = await productManager.getProducts()
        const limit = req.query.limit;
        res.status(200).json({products: result.slice( 0, limit )})
    }catch (err) {
        res.status(500).json({error: err, description: 'No se encuentran los products por el momento'})
    }
})

router.get('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    try{
        const result = await productManager.getProductsById( id )
        return res.status(200).json({ playload: result })
    }catch(err){
        const result = await productManager.getProductsById( id )
        return res.status(400).send({ error: result, message: `Dind't found ID:${ id }`})
    }
})


router.post('/', async(req, res) => {
    const product = req.body
    const products = await productManager.getProducts()
    product.id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
    products.push( product )
    res.status(200).json( product )
})

export default router 