import { Router } from "express";
import { Carts_managerFS } from "../dao/fs/carts_managerFS.js";
import { routCartJSON, routProductJSON } from "../routesJSON/routes.js";
import cartsModels from "../dao/models/carts.models.js";

const cartManager = new Carts_managerFS(routCartJSON, routProductJSON);

const router = Router();

router.get("/:cid", async (req, res) => {
  const id = +req.params.cid;
  try {
    res.json({ success: await cartManager.getCartById(id) });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

router.post("/", async (req, res) => {
  // const data = await cartManager.createCart();
  const data = await cartsModels.find().lean().exec();
  res.json({ success: data });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;

  try {
    const productToAdd = await cartManager.addToCart(cid, pid);
    res.json({ success: productToAdd });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

export default router;
