import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";

const objectId = mongoose.Types.ObjectId;

import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
import { routProductJSON } from "../routesJSON/routes.js";


import { ProductManagerDB } from "../dao/db/products_managerDB.js";

const productManagerFS = new ProductManagerFS(routProductJSON);

const productsManagerDB = new ProductManagerDB();

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploader = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const result = await productsManagerDB.getProducts();
    const limit = req.query.limit;
    res.status(200).json({ payload: result.slice(0, limit) });
    
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err,
      description: "No se encuentran los products por el momento",
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    // const result = await productManagerFS.getProductsById(id);
    const result = await productsManagerDB.getProductsById( id )
    return res.status(200).json({ payload: result });
  } catch (err) {
    return res.status(400).send({ status: "error", error: err });
  }
});

router.get("/query/:pcode", async (req, res) => {
  const code = req.params.pcode;
  
  try {
    const prod = await productsManagerDB.isProductsByCode( code );
    return res.status(200).json({ payload: prod });
  } catch (err) {
    return res.status(400).send({ status: "error", error: err });
  }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    const product = JSON.parse(JSON.stringify(req.body));
    console.log( product )
    const url = req.file?.filename;
    console.log( req.file )
    product.thumbnail = url ? `${Date.now()}-${url}` : undefined;
    product.price = +product.price;
    product.stock = +product.stock;
    product.status = product.status === "true";

    await productsManagerDB.addProduct( product );
    res.status(200).json(product);
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.put("/:pid", uploader.single("thumbnail"), async (req, res) => {
  try {
    const id = req.params.pid;
    const product = req.body;
    console.log( id, req.file )

    const url = req.file?.filename;
    product.thumbnail = url ? `${Date.now()}-${url}` : ['without image'];
    product.price = +product.price;
    product.stock = +product.stock;
    product.status = product.status === "true";
    console.log( id, product )

    // await productManagerFS.updateProduct(id, product);
    await productsManagerDB.updateProduct( id, product );
    res.json(product);
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  console.log( id )
  try {
    await productsManagerDB.deleteProduct(id);

    
    const products = await productsManagerDB.getProducts();

    res.json({ payload: products });

  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

export default router;
