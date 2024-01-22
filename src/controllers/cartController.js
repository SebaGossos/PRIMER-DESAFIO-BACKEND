import { CartService, ProductService } from "../repositories/index.js";

export default class CartController {
  async getAll(req, res) {
    try {
      res.json({ status: 'success', success: await CartService.getAll() });
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async getById(req, res) {
    const id = req.params.cid;
    try {
      res.json({ status: "success", payload: await CartService.getById(id) });
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async create( req, res ) {
    try {
      const createCart = await CartService.create();
      console.log( createCart )      
      res.json({ status: 'success', payload: createCart})
    } catch {
      res.json({ status: 'error', message: 'Error To Create a Cart' })
    }
  }

  async update(req, res) {
    const cid = req.params.cid;
    const body = req.body;

    try {
      const { updatedByMongo, cartUpdated } = await CartService.update( cid, body );

      res.json({
        status: "success",
        message: updatedByMongo,
        payload: cartUpdated,
      });

    } catch (err) {
      if (err.httpError) {
        res.status(err.httpError).json({ status: "error", error: err.desc });
      } else {
        res.status(500).json({ status: "error", error: err.message });
      }
    }
  }

  async updateQuantity(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const body = req.body;

    try {
      const { updatedByMongo, cartUpdated } = await CartService.updateQuantity(cid, pid, body);
      res.json({
        status: "success",
        message: updatedByMongo,
        payload: cartUpdated,
      });
    } catch (err) {
      if (err.httpError) {
        res.status(err.httpError).json({ status: "error", error: err.desc });
      } else {
        res.status(500).json({ status: "error", error: err.message });
      }
    }
  }

  async addToCart(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {

      if( req.user.role === 'premium' ){
        const product = await ProductService.getById( pid );
        if ( product?.owner === req.user.email ) return res.status(500).send({ status: "error", message: `You can´t add your own product`});
      }
      const { addToCartByMongo, cartAdded } = await CartService.addToCart(
        cid,
        pid
      );
      res.json({
        status: "success",
        message: addToCartByMongo,
        payload: cartAdded,
      });
    } catch (err) {
      res.status(400).send({ status: "error", error: err });
    }
  }

  async delete(req, res) {
    const cid = req.params.cid;

    try {
      const cartDeleted = await CartService.delete( cid );
      res.json({ status: "success", payload: cartDeleted });
    } catch (err) {
      if (err.httpError) {
        res.status(err.httpError).json({ status: "error", error: err.desc });
      } else {
        res.status(500).json({ status: "error", error: err.message });
      }
    }
  }

  async deleteProdById(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
      const { updatedByMongo, cartToUpdate } =
      await CartService.deleteProdById(cid, pid);
      res.json({
        status: "success",
        message: updatedByMongo,
        payload: cartToUpdate,
      });
    } catch (err) {
      if (err.httpError) {
        res.status(err.httpError).json({ status: "error", error: err.desc });
      } else {
        res.status(500).json({ status: "error", error: err.message });
      }
    }
  }
}
