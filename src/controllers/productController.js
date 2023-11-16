import { ProductManagerDB } from "../dao/db/products_managerDB.js";
const productsManagerDB = new ProductManagerDB();

import { ProductService } from "../repositories/index.js";

import { PORT } from "../app.js";

// export const getProducts = async ( req, res ) => {

//   const { limit, page, sort, stock, category } = req.query;

//   const { docs, totalPages, prevPage, nextPage, page: pagePaginate, hasPrevPage, hasNextPage } = await productsManagerDB.paginate({ stock, category },{ limit, page, sort });

//   const originalUrl = req.originalUrl.at(-1) === '/' ? req.originalUrl.pop() : req.originalUrl;
//   const andOrQuestion = originalUrl === '/products' ? '?' : '&';

//   let prevLink;
//   if ( !page ){
//     prevLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${prevPage}`;
//   } else {
//     const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${prevPage}`);
//     prevLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
//   }

//   let nextLink
//   if ( !page ){
//     nextLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${nextPage}`;
//   } else {
//     const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${nextPage}`);
//     nextLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
//   }

//   return {
//     status: 'success',
//     payload: docs,
//     page: pagePaginate,
//     totalPages,
//     prevPage,
//     nextPage,
//     hasPrevPage,
//     hasNextPage,
//     prevLink,
//     nextLink
//   };

// }

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

      // await productManagerFS.updateProduct(id, product);
      await ProductService.update(id, product);
      res.json(product);
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async delete(req, res) {
    const id = req.params.pid;
    console.log(id);

    try {
      await ProductService.deleteById(id);
      const products = await ProductService.getAll();

      res.json({ payload: products });
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }
}
