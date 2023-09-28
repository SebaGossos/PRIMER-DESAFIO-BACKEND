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
    res.json({ success: await cartManagerDB.getCartById( id ) })
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.post("/", async (req, res) => {
  const data = await cartManagerDB.createCart();
  try{
    res.json({ success: data });
  }catch( err ){
    res.status(400).send({ status: "error", error: err });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const productToAdd = await cartManagerDB.addToCart(cid, pid);
    res.json({ success: productToAdd });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

export default router;
