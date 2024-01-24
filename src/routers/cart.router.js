import MyRouter from "./router.js";
import passport from "passport";

import { cartController } from "../controllers/index.js";
import { ticketController } from "../controllers/index.js";
import { getBill } from "../controllers/checkoutController.js";




export default class CartRouter extends MyRouter {
  init() {
    this.get('/', ['PUBLIC'], cartController.getAll)

    this.post("/", ['PUBLIC'], cartController.create)

    this.get("/:cid", ['PUBLIC'], cartController.getById)

    this.put('/:cid', ['USER', 'PREMIUM'], cartController.update)

    this.delete('/:cid', ['ADMIN'], cartController.delete)

    this.delete('/delete/:email', ['USER', 'PREMIUM'], cartController.deleteByEmail)

    this.get('/:cid/purchase', ['USER', 'PREMIUM'], ticketController.purchase)

    this.post('/getbill', ['USER', 'PREMIUM'], getBill)
    
    this.post("/:cid/product/:pid", ['USER', 'PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), cartController.addToCart)
      
    this.put('/:cid/product/:pid', ['USER', 'PREMIUM'], cartController.updateQuantity)
    
    this.delete('/:cid/product/:pid', ['PUBLIC'], cartController.deleteProdById)

  }
} 