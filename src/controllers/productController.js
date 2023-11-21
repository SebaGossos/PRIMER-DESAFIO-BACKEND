import { ProductService } from "../repositories/index.js";
import { PORT } from "../app.js";

export default class ProductController {
  async getAll(req, res) {
    try {
      // const result = await getProducts(req, res);

      const resultDao = await ProductService.getAll();

      res.status(200).json({ payload: resultDao });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: err,
        description: "No se encuentran los products por el momento",
      });
    }
  }

  async getAllPaginate(req, res) {
    try {
      // const result = await getProducts(req, res);

      const resultDao = await ProductService.getAllPaginate(req, PORT);

      res.status(200).json(resultDao);
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: err,
        description: "No se encuentran los products por el momento",
      });
    }
  }

  async getById(req, res) {
    const id = req.params.pid;

    try {
      const result = await ProductService.getById(id);
      return res.status(200).json({ payload: result });
    } catch (err) {
      return res.status(400).send({ status: "error", error: err });
    }
  }

  async getByCode(req, res) {
    const code = req.params.pcode;

    try {
      const prod = await ProductService.getByCode(code);
      return res.status(200).json({ payload: prod });
    } catch (err) {
      return res.status(400).send({ status: "error", error: err });
    }
  }

  async create(req, res) {
    try {
      const product = JSON.parse(JSON.stringify(req.body));
      const url = req.file?.filename;
      product.thumbnail = url ? `${Date.now()}-${url}` : undefined;
      product.price = +product.price;
      product.stock = +product.stock;
      product.status = product.status === "true";

      await ProductService.create(product);
      res.status(200).json(product);
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async updated(req, res) {
    try {
      const id = req.params.pid;
      const product = req.body;
      const url = req.file?.filename;
      product.thumbnail = url ? `${Date.now()}-${url}` : ["without image"];
      product.price = +product.price;
      product.stock = +product.stock;
      product.status = product.status === "true";

      await ProductService.update(id, product);
      res.json(product);
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async delete(req, res) {
    const id = req.params.pid;

    try {
      await ProductService.deleteById(id);
      const products = await ProductService.getAll();

      res.json({ payload: products });
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }
}
