import { ProductService } from "../repositories/index.js";
import { PORT } from "../app.js";
import { createMockingProducts } from "../utilis/utils.js";

export default class ProductController {
  async getAll(req, res) {
    try {
      
      let resultDao
      if ( req.user?.role === 'premium' ) resultDao = await ProductService.getAllByEmail( req.user?.email )
      else resultDao = await ProductService.getAll();
    
      res.status(200).json({ status: 'success', payload: resultDao });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: err,
        description: "No se encuentran los products por el momento",
      });
    }
  }

  async mockingProducts(req, res) {
    let products = [];
    for (let i = 0; i < 101; i++) products.push(await createMockingProducts());
    try {
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllPaginate(req, res, next) {
    try {
      // const result = await getProducts(req, res);

      const resultDao = await ProductService.getAllPaginate(req, PORT);

      res.status(200).json(resultDao);
    } catch (error) {
      next(error);
      res.status(500).json({
        status: "error",
        error: error,
        description: "No se encuentran los products por el momento",
      });
    }
  }

  async getById(req, res, next) {

    const id = req.params.pid;
    console.log(id)

    try {
      const result = await ProductService.getById(id);
      return res.status(200).json({ payload: result });
    } catch (error) {
      next(error);
      // return res.status(400).send({ status: "error", error: err });
    }
  }

  async getByCode(req, res, next) {

    const code = req.params.pcode;

    try {
      const product = await ProductService.getByCode(code);
      
      if( req.user?.role === 'premium' ) {
        if( product.owner !== req.user?.email ) return res.json({ status:'error', error:'You can not search this product' });
      }
      return res.status(200).json({ payload: product });
    } catch (error) {
      next(error);
      // return res.status(400).send({ status: "error", error: err });
    }
  }

  async create(req, res, next) {
    try {
      const product = JSON.parse(JSON.stringify(req.body));
      const url = req.file?.filename;
      product.thumbnail = url ? `${Date.now()}-${url}` : undefined;
      product.status = product.status === "true";
      if( req.user.role === 'premium' ) {
        product.owner = req.user.email
      }
      await ProductService.create(product);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async updated(req, res) {
    try {
      const id = req.params.pid;
      if( !id ) return res.json({ status:'error', error:'You must send an id to update this product' });
      
      if( req.user.role === 'premium' ) {
        const product = await ProductService.getById( id )
        console.log(33)
        if( product.owner !== req.user.email ) return res.json({ status:'error', error:'You can only update your own products' });
      }

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

      if( req.user.role === 'premium' ) {
        const product = await ProductService.getById( id )
        if( product.owner !== req.user.email ) return res.json({ status:'error', error:'You can not delete this product' });
      }
      await ProductService.deleteById(id);      

      res.json({ status: 'sueccess', message: 'Product deleted successfully' });
    } catch (error) {
      next( error )
      res.status(400).send({ status: "error", error });
    }
  }
}
