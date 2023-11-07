import { getProducts } from "../routers/products.router.js";
import { ProductManagerDB } from "../dao/db/products_managerDB.js";
const productsManagerDB = new ProductManagerDB();
export default class ProductController {
    
    async getProductsController( req, res ) {
        try {
          const result = await getProducts(req, res);  
          
          res.status(200).json(result);
      
        } catch (err) {
          res.status(500).json({
            status: "error",
            error: err,
            description: "No se encuentran los products por el momento",
          });
        }
    }

    async getProductById( req, res ) {
        const id = req.params.pid;
  
        try {
          const result = await productsManagerDB.getProductsById( id )
          return res.status(200).json({ payload: result });
        } catch (err) {
          return res.status(400).send({ status: "error", error: err });
        }
    }

    async getProductByCode( req, res ) {
        const code = req.params.pcode;
        
        try {
          const prod = await productsManagerDB.isProductsByCode( code );
          return res.status(200).json({ payload: prod });
        } catch (err) {
          return res.status(400).send({ status: "error", error: err });
        }
    }

    async createProduct( req, res ) {
        try {
          const product = JSON.parse(JSON.stringify(req.body));
          const url = req.file?.filename;
          product.thumbnail = url ? `${Date.now()}-${url}` : undefined;
          product.price = +product.price;
          product.stock = +product.stock;
          product.status = product.status === "true";
      
          await productsManagerDB.addProduct( product );
          res.status(200).json(product);
        } catch (err) {
          res.status(400).send({ status: "error", error: err });
        }
    }

    async updatedProduct( req, res ) {

        try {
          const id = req.params.pid;
          const product = req.body;
          const url = req.file?.filename;
          product.thumbnail = url ? `${Date.now()}-${url}` : ['without image'];
          product.price = +product.price;
          product.stock = +product.stock;
          product.status = product.status === "true";
      
          // await productManagerFS.updateProduct(id, product);
          await productsManagerDB.updateProduct( id, product );
          res.json(product);
        } catch (err) {
          res.status(400).send({ status: "error", error: err });
        }
    }

    async deleteProduct( req, res ) {
        const id = req.params.pid;
      
        try {
          await productsManagerDB.deleteProduct(id);
          const products = await productsManagerDB.getProducts();
          res.json({ payload: products });
      
        } catch (err) {
          res.status(400).send({ status: "error", error: err });
        }
    }
    
}