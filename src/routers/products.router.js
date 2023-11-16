
import MyRouter from "./router.js";

import ProductController from "../controllers/productController.js";
const productController = new ProductController()

import multer from "multer";

import { storage } from "../utils.js";

const uploader = multer({ storage });


export default class ProductsRouter extends MyRouter {
  init(){

    this.get("/", ['USER','ADMIN'], productController.getAll)

    this.get("/:pid", ['USER','ADMIN'], productController.getById)
    
    this.get("/query/:pcode", ['USER','ADMIN'], productController.getByCode)
    
    this.post("/", ['ADMIN'], uploader.single("thumbnail"), productController.create)

    this.put("/:pid", ['ADMIN'], uploader.single("thumbnail"), productController.updated)
    
    this.delete("/:pid", ['ADMIN'], productController.delete)
  }
}