import { Router } from "express";
import { ProductManager } from "../products_manager.js";
import { routProductJSON } from "../routesJSON/routes.js";

const productManager = new ProductManager( routProductJSON );

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts();
    const limit = req.query.limit;
    res.status(200).json({ products: result.slice(0, limit) });
  } catch (err) {
    res
      .status(500)
      .json({
        error: err,
        description: "No se encuentran los products por el momento",
      });
  }
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    const result = await productManager.getProductsById(id);
    return res.status(200).json({ playload: result });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.put("/:pid", async (req, res) => {
  const id = Number(req.params.pid);
  const product = req.body;
  try {
    await productManager.updateProduct(id, product);
    res.json(product);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = +req.params.pid;
  try {
    await productManager.deleteProduct(id);
    res.json({ playload: `Product ID: ${id} was successfully removed` });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

export default router;

