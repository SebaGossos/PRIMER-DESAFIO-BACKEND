import MyRouter from "./router.js";
import { CartManagerDB } from "../dao/db/carts_managerDB.js";

const cartManagerDB = new CartManagerDB();

export const getCarts = async ( req, res ) => {
  const cid = req.params.cid;
  const cart = await cartManagerDB.getCartById( cid )
  return cart 
}

export default class CartRouter extends MyRouter {
  init() {
    this.get('/', ['PUBLIC'], async( req, res ) => {
      try{
        res.json({ success: await cartManagerDB.getCarts() })
      }catch( err ) {
        res.status(400).send({ status: 'error', error: err })
      }
    })

    this.get("/:cid", ['PUBLIC'], async ( req, res ) => {
      const id = req.params.cid;
      try {
        res.json({ status: 'success', payload: await cartManagerDB.getCartById( id ) })
      } catch (err) {
        res.status(400).send({ status: "error", error: err });
      }
    })

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

    this.post("/:cid/product/:pid", ['PUBLIC'], async ( req, res ) => {
      const cid = req.params.cid;
      const pid = req.params.pid;
    
      try {
        const { addToCartByMongo ,cartAdded } = await cartManagerDB.addToCart(cid, pid);
        res.json({ status: 'success', message: addToCartByMongo, payload: cartAdded });
      } catch (err) {
        res.status(400).send({ status: "error", error: err });
      }
    })

    this.put('/:cid/', ['PUBLIC'], async ( req, res ) => {
      const cid = req.params.cid;
      const body = req.body;
    
      try {
        const { updatedByMongo, cartUpdated } = await cartManagerDB.updateCart( cid, body )
        res.json({ status: 'success', message: updatedByMongo, payload: cartUpdated })
      } catch (err) {
        
        if ( err.httpError ) {
          res.status(err.httpError).json({ status: 'error', error: err.desc })
        } else {
          res.status(500).json({ status: 'error', error: err.message })
        }
    
      }
    })

    this.put('/:cid/product/:pid', ['PUBLIC'], async ( req, res ) => {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const body = req.body;
    
      try {
        const { updatedByMongo, cartUpdated } = await cartManagerDB.updateQuantity( cid, pid, body );
        res.json({ status: 'success', message: updatedByMongo, payload: cartUpdated })
    
      } catch (err) {
    
        if ( err.httpError ) {
          res.status(err.httpError).json({ status: 'error', error: err.desc })
        } else {
          res.status(500).json({ status: 'error', error: err.message })
        }
    
      }
    })

    this.delete('/:cid', ['PUBLIC'], async ( req, res ) => {
      const cid = req.params.cid;
      
      try{
        const cartDeleted = await cartManagerDB.deleteProductsByCart( cid );
        res.json({ status: 'success', payload: cartDeleted })
    
      } catch (err) {
    
        if ( err.httpError ) {
          res.status(err.httpError).json({ status: 'error', error: err.desc })
        } else {
          res.status(500).json({ status: 'error', error: err.message })
        }
    
      }
    })
    
    this.delete('/:cid/product/:pid', ['PUBLIC'], async ( req, res ) => {
      const cid = req.params.cid;
      const pid = req.params.pid;
    
      try {
        const { updatedByMongo ,cartToUpdate } = await cartManagerDB.deleteProductByCart(cid, pid)
        res.json({ status: 'success', message: updatedByMongo, payload: cartToUpdate })
      } catch (err) {
    
        if ( err.httpError ) {
          res.status(err.httpError).json({ status: 'error', error: err.desc })
        } else {
          res.status(500).json({ status: 'error', error: err.message })
        }
    
      }
    })
    
  }
}