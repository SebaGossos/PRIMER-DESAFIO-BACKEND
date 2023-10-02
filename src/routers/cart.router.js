import { Router } from "express";
import { CartManagerDB } from "../dao/db/carts_managerDB.js";

// import { Carts_managerFS } from "../dao/fs/carts_managerFS.js";
// import { routCartJSON, routProductJSON } from "../routesJSON/routes.js";
// const cartManager = new Carts_managerFS(routCartJSON, routProductJSON);

const cartManagerDB = new CartManagerDB();

const router = Router();



router.get('/', async(req, res) => {
  try{
    res.json({ success: await cartManagerDB.getCarts() })
  }catch( err ) {
    res.status(400).send({ status: 'error', error: err })
  }
})

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  try {
    res.json({ status: 'success', payload: await cartManagerDB.getCartById( id ) })
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.post("/", async (req, res) => {
  const data = await cartManagerDB.createCart();
  try{
    res.json({ status: 'success', payload: data });
  }catch( err ){
    res.status(400).send({ status: "error", error: err });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const { addToCartByMongo ,cartAdded } = await cartManagerDB.addToCart(cid, pid);
    res.json({ status: 'success', message: addToCartByMongo, payload: cartAdded });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});


router.put('/:cid/', async (req, res) => {
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

//TODO: COMPLETE THIS ONE
router.put('/:cid/product/:pid', async (req, res) => {
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


router.delete('/:cid/product/:pid', async (req, res) => {
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

export default router;
