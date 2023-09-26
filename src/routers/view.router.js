import { Router } from "express";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// const productsManagerFS = new ProductManagerFS(routProductJSON);


const productsManagerDB = new ProductManagerDB();

const router = Router();

//! PRODUCTS
router.get("/products", async (req, res) => {
  const products = await productsManagerDB.getProducts()
  res.render("home", { products });
});

router.get("/products/realtimeproducts", async (req, res) => {
  const products = await productsManagerDB.getProducts();
  res.render("realTimeProducts", { products });
});



//! MESSAGES

router.get('/chat', async(req, res) => {
  res.render('chat')
})



export default router;
