import { Router } from "express";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";


// const productsManagerFS = new ProductManagerFS(routProductJSON);

const productsManagerDB = new ProductManagerDB();

const router = Router();

router.get("/", async (req, res) => {
  // const products = await productsModel.find().lean().exec();
  const products = await productsManagerDB.getProducts()
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productsManagerDB.getProducts();
  res.render("realTimeProducts", { products });
});

// router.post('/', uploader.single('thumbnail'), async( req, res ) => {
//     const prod = JSON.parse(JSON.stringify( req.body ))
//     prod.price = +prod.price
//     prod.stock = +prod.stock
//     prod.status = !!prod.status
//     const url = req.file?.filename
//     if( url ) prod.thumbnail = `${Date.now()}-${ url }`

//     console.log( prod )

//     try{
//         await productsManagerFS.addProduct( prod )
//         const products = await productsManagerFS.getProducts()
//         res.render('realTimeProducts', {
//             products
//         })
//     }catch( err ){
//         res.status(400).json({ error: err })
//     }
// })

export default router;
