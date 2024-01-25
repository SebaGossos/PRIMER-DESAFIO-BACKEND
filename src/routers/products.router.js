import multer from "multer";
import passport from "passport";

import MyRouter from "./router.js";
import { productController } from "../controllers/index.js";

import { storage } from "../utilis/utils.js";

const uploader = multer({ storage });

export default class ProductsRouter extends MyRouter {
  init() {
    this.get("/", ['TEST',"USER", "ADMIN"], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), productController.getAll);
    
    this.get("/mockingproducts", ["PUBLIC"], productController.mockingProducts);

    this.post(
      "/",
      ["ADMIN", 'PREMIUM'],
      passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),
      uploader.single("thumbnail"),
      productController.create
    );


    this.get("/:pid", ['TEST',"USER", "ADMIN", "PUBLIC"], productController.getById);
    
    this.put(
      "/:pid",
      ["ADMIN", 'PREMIUM'],
      passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),
      uploader.single("thumbnail"),
      productController.updated
    );

    this.delete("/:pid", ["ADMIN", 'PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), productController.delete);


    this.get("/query/:pcode", ["USER", "ADMIN", 'PREMIUM', "PUBLIC"], productController.getByCode);
 
  }
}
