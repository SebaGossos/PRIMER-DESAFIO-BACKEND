import MyRouter from "./router.js";
import { CartManagerDB } from "../dao/db/carts_managerDB.js";
import CartController from "../controllers/cartController.js";

const cartManagerDB = new CartManagerDB();

const cartController = new CartController()

export const getCarts = async ( req, res ) => {
  const cid = req.params.cid;
  const cart = await cartManagerDB.getCartById( cid )
  return cart 
}

export default class CartRouter extends MyRouter {
  init() {
    this.get('/', ['PUBLIC'], cartController.getCarts)

    this.get("/:cid", ['PUBLIC'], cartController.getCartById)
    
    this.post("/:cid/product/:pid", ['PUBLIC'], cartController.getProductInCartById)
    
    this.put('/:cid/', ['PUBLIC'], cartController.updateCartById)
    
    this.put('/:cid/product/:pid', ['PUBLIC'], cartController.updateQuantityProdByCart)
    
    this.delete('/:cid', ['PUBLIC'], cartController.deleteCartById)
    
    this.delete('/:cid/product/:pid', ['PUBLIC'], cartController.deleteProdInCartById)

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