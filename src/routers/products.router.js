import multer from "multer";

import MyRouter from "./router.js";
import { PORT } from "../app.js";

import ProductController from "../controllers/productController.js";
const productController = new ProductController()


import { ProductManagerDB } from "../dao/db/products_managerDB.js";
const productsManagerDB = new ProductManagerDB();


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

export default class ProductsRouter extends MyRouter {
  init(){

    this.get("/", ['PUBLIC'], productController.getProductsController)

    this.get("/:pid", ['PUBLIC'], productController.getProductById)
    
    this.get("/query/:pcode", ['PUBLIC'], productController.getProductByCode)
    
    this.post("/", ['PUBLIC'], uploader.single("thumbnail"), productController.createProduct)

    this.put("/:pid", ['PUBLIC'], uploader.single("thumbnail"), productController.updatedProduct)
    
    this.delete("/:pid", ['PUBLIC'], productController.deleteProduct)
  }
}