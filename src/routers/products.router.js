
import MyRouter from "./router.js";

import ProductController from "../controllers/productController.js";
const productController = new ProductController()

import multer from "multer";

import { storage } from "../utils.js";

const uploader = multer({ storage });


export default class ProductsRouter extends MyRouter {
  init(){

    this.get("/", ['PUBLIC'], productController.getAll)

    this.get("/:pid", ['PUBLIC'], productController.getById)
    
    this.get("/query/:pcode", ['PUBLIC'], productController.getByCode)
    
    this.post("/", ['PUBLIC'], uploader.single("thumbnail"), productController.create)

    this.put("/:pid", ['PUBLIC'], uploader.single("thumbnail"), productController.updated)
    
    this.delete("/:pid", ['PUBLIC'], productController.delete)
  }
}