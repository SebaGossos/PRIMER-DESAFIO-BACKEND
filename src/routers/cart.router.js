import MyRouter from "./router.js";
import { cartController } from "../controllers/index.js";
import { ticketController } from "../controllers/index.js";
import { getBill } from "../controllers/checkoutController.js";




export default class CartRouter extends MyRouter {
  init() {
    this.get('/', ['PUBLIC'], cartController.getAll)

    this.get("/:cid", ['PUBLIC'], cartController.getById)

    this.get('/:cid/purchase', ['USER'], ticketController.purchase)

    this.post('/getbill', ['USER'], getBill)
    
    this.post("/:cid/product/:pid", ['USER'], cartController.addToCart)
    
    this.put('/:cid/', ['USER'], cartController.update)
    
    this.put('/:cid/product/:pid', ['USER'], cartController.updateQuantity)
    
    this.delete('/:cid', ['PUBLIC'], cartController.delete)
    
    this.delete('/:cid/product/:pid', ['PUBLIC'], cartController.deleteProdById)

    //todo: IF THERE IS NO ERROR, DELETE.

    // this.post("/", async ( req, res ) => {
    //   const cart = req.user.cart;
    //   try{
    //     console.log(33)
    //     res.json({ status: 'success', payload: cart });
    //   }catch( err ){
    //     res.status(400).send({ status: "error", error: err });
    //   }
    // })
    
  }
}