import { Router } from "express";
import { Carts_manager } from "../carts_manager.js";
import { routCartJSON, routProductJSON } from "../routesJSON/routes.js";

const cartManager = new Carts_manager( routCartJSON, routProductJSON );

const router = Router();

router.post("/", async (req, res) => {
  const data = await cartManager.createCart();
  res.json({ success: data });
});

router.get("/:cid", async (req, res) => {
  const id = +req.params.cid;
  try {
    res.json({ success: await cartManager.getCartById(id) });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;

  try {
    const productToAdd = await cartManager.addToCart( cid, pid );
    res.json({ success: productToAdd })
  } catch (err) {
    res.status(400).send({ error: err })
  }
});

export default router;
