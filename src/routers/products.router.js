import { Router } from "express";
import multer from "multer";
import { PORT } from "../app.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

// import mongoose from "mongoose";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// import { routProductJSON } from "../routesJSON/routes.js";
// const productManagerFS = new ProductManagerFS(routProductJSON);

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

export const getProducts = async ( req, res ) => {

    const { limit, page, sort, stock, category } = req.query;

    const result = await productsManagerDB.paginate({ stock, category },{ limit, page, sort });
    const originalUrl = req.originalUrl.at(-1) === '/' ? req.originalUrl.pop() : req.originalUrl;
    const andOrQuestion = originalUrl === '/products' ? '?' : '&';

    let prevLink;
    if ( !page ){
      prevLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${result.prevPage}`;
    } else {
      const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${result.prevPage}`);
      prevLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
    }

    let nextLink
    if ( !page ){
      nextLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${result.nextPage}`;
    } else {
      const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${result.nextPage}`);
      nextLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
    }

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    };
    
}

router.get("/", async ( req, res ) => {
  try {
    // const result = await productsManagerDB.getProducts();
    const result = await getProducts(req, res);  
    
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err,
      description: "No se encuentran los products por el momento",
    });
  }
});

router.get("/:pid", async ( req, res ) => {
  const id = req.params.pid;

  try {
    // const result = await productManagerFS.getProductsById(id);
    const result = await productsManagerDB.getProductsById( id )
    return res.status(200).json({ payload: result });
  } catch (err) {
    return res.status(400).send({ status: "error", error: err });
  }
});

router.get("/query/:pcode", async ( req, res ) => {
  const code = req.params.pcode;
  
  try {
    const prod = await productsManagerDB.isProductsByCode( code );
    return res.status(200).json({ payload: prod });
  } catch (err) {
    return res.status(400).send({ status: "error", error: err });
  }
});

router.post("/", uploader.single("thumbnail"), async ( req, res ) => {
  try {
    const product = JSON.parse(JSON.stringify(req.body));
    const url = req.file?.filename;
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

router.put("/:pid", uploader.single("thumbnail"), async ( req, res ) => {
  try {
    const id = req.params.pid;
    const product = req.body;

    const url = req.file?.filename;
    product.thumbnail = url ? `${Date.now()}-${url}` : ['without image'];
    product.price = +product.price;
    product.stock = +product.stock;
    product.status = product.status === "true";

    // await productManagerFS.updateProduct(id, product);
    await productsManagerDB.updateProduct( id, product );
    res.json(product);
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.delete("/:pid", async ( req, res ) => {
  const id = req.params.pid;

  try {
    await productsManagerDB.deleteProduct(id);
    const products = await productsManagerDB.getProducts();
    res.json({ payload: products });

  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

export default router;
