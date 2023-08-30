import { Router } from "express";
import { ProductManager } from "../products_manager.js";
import { routProductJSON } from "../routesJSON/routes.js";

const productsManager = new ProductManager( routProductJSON )

const router = Router();


router.get('/', async( req, res ) => {
    const products = await productsManager.getProducts()
    res.render('home', {
        products
    })
}) 


export default router;
