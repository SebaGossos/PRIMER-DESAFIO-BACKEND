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

export default router;
