import { ProductService } from "../repositories/index.js";
import { PORT } from "../app.js";
import { createMockingProducts } from "../utils.js";

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

  async mockingProducts( req, res ) {
    let products = []
    for ( let i=0; i < 101; i++) products.push( await createMockingProducts() )
    try{
      res.status(200).json( products )
    } catch( err ) {
      res.status(500).json( err )
    }
  }

  async getAllPaginate(req, res, next) {
    try {
      // const result = await getProducts(req, res);

      const resultDao = await ProductService.getAllPaginate(req, PORT);

      res.status(200).json(resultDao);
    } catch (error) {

      next( error )
      res.status(500).json({
        status: "error",
        error: error,
        description: "No se encuentran los products por el momento",
      });
    }
  }

  async getById(req, res, next) {
    const id = req.params.pid;

    try {
      const result = await ProductService.getById(id);
      return res.status(200).json({ payload: result });
    } catch (error) {
      next( error )
      // return res.status(400).send({ status: "error", error: err });
    }
  }

  async getByCode(req, res, next) {
    const code = req.params.pcode;

    try {
      const prod = await ProductService.getByCode(code);
      return res.status(200).json({ payload: prod });
    } catch (error) {
      next( error )
      // return res.status(400).send({ status: "error", error: err });
    }
  }

  async create(req, res, next) {
    try {
      const product = JSON.parse(JSON.stringify(req.body));
      const url = req.file?.filename;
      product.thumbnail = url ? `${Date.now()}-${url}` : undefined;
      product.status = product.status === "true";

      await ProductService.create(product);
      res.status(200).json(product);
    } catch (error) {
      next(error)
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
