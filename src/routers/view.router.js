import { Router } from "express";
import { ProductManager } from "../products_manager.js";
import { routProductJSON } from "../routesJSON/routes.js";
import multer from "multer"

const productsManager = new ProductManager( routProductJSON )

const router = Router();

const storage = multer.diskStorage({
    destination: function( req, file, cb ){
        cb( null, 'public/' )
    },
    filename: function( req, file, cb ){
        cb( null, file.originalname )
    }
})
const uploader = multer({ storage });

router.get('/', async( req, res ) => {
    const products = await productsManager.getProducts()
    res.render('home', {
        products
    })
})

router.get('/realtimeproducts', async( req, res ) => {
    const products = await productsManager.getProducts()
    res.render('realTimeProducts',{
        products
    })
})

router.post('/', uploader.single('thumbnail'), async( req, res ) => {
    const prod = JSON.parse(JSON.stringify( req.body ))
    prod.price = +prod.price
    prod.stock = +prod.stock
    prod.status = !!prod.status
    const url = req.file?.filename
    if( url ) prod.thumbnail = `${Date.now()}-${ url }`

    console.log( prod )
    
    try{
        await productsManager.addProduct( prod )
        const products = await productsManager.getProducts()
        res.render('realTimeProducts', {
            products
        }) 
    }catch( err ){
        res.status(400).json({ error: err })
    }
})

export default router;
