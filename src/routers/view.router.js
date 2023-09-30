import { Router } from "express";
import { getProducts } from "./products.router.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// const productsManagerFS = new ProductManagerFS(routProductJSON);


const productsManagerDB = new ProductManagerDB();

const router = Router();

//! PRODUCTS
router.get("/products", async (req, res) => {
  const result = await getProducts(req, res)
  // const products = await productsManagerDB.getProducts()
  res.render("home", { products: result.payload });
});

router.get("/products/realtimeproducts", async (req, res) => {
  const products = await productsManagerDB.getProducts();
  res.render("realTimeProducts", { products });
});



//! CHAT
router.get('/chat', async(req, res) => {
  res.render('chat')
})



export default router;
