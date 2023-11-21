import { cartModel } from "../../models/Cart.js";
//TODO: preguntar por esta importacion al tutor o profe porque cuando descomento me crashea la app, QUIERO ENTENDEEER
// import { ProductService } from "../../repositories/index.js";
import ProductsMongo from "./productDB.js";

export default class CartsMongo {
  constructor(productsDAO) {
    this.productsDAO = productsDAO;
  }
  getAll = async () => await cartModel.find().lean().exec();

  getById = async (id) => {
    const cart = await cartModel.findById(id).populate("products.pId");
    if (!cart) throw `Cart with id: ${id} not found`;
    return cart;
  };

  create = async () => await cartModel.create({ products: [] });

  update = async (cid, change) => {
    //! HANDLE ERRORS
    const data = await cartModel.findById(cid).populate("products.pId");
    if (!data)
      throw { httpError: 404, desc: `The cartId : ${cid} was not found` };
    let products = change.products;
    if (!products)
      throw {
        httpError: 404,
        desc: `Must send a products as property, not: ${change.products}`,
      };
    products = await Promise.all(
      products.map(async (p) => {
        if (!p.pId || typeof p.quantity === "undefined")
          throw {
            httpError: 400,
            desc: `Must send a product with pId and quantity as property, not: ${
              p.pId && p.quantity
            }`,
          };
        // const product = await productManagerDb.getProductsById( p.pId );
        // const product = await ProductService.getById(p.pId);
        const product = await this.productsDAO.getById(p.pId);
        if (!product)
          throw {
            httpError: 404,
            desc: `The productId : ${pid} was not found`,
          };
        if (typeof p.quantity !== "number" || p.quantity < 1)
          throw {
            httpError: 400,
            desc: `Quantity from product must be a number greater than: ${p.quantity}`,
          };
        return p;
      })
    );

    //? SOLUTION

    data.products = products;
    const updatedByMongo = await cartModel.findByIdAndUpdate(cid, data);

    return { updatedByMongo, cartUpdated: data };
  };

  updateQuantity = async (cid, pid, change) => {
    //! HANDLE ERRORS
    const data = await cartModel.findById(cid).lean();
    const cart = JSON.parse(JSON.stringify(data, null, 2));
    const isProdInCart = cart.products.some((p) => p.pId === pid);
    if (!data)
      throw { httpError: 404, desc: `The cartId : ${cid} was not found` };
    if (!change.quantity)
      throw {
        httpError: 400,
        desc: `Must send an object with quantity as property, not: ${change.quantity}`,
      };
    if (!isProdInCart)
      throw {
        httpError: 404,
        desc: `The productId : ${pid} was not found in the cart`,
      };

    //? SOLUTION
    cart.products.forEach((p) => {
      if (p.pId === pid) return (p.quantity = change.quantity);
      return p;
    });
    const updatedByMongo = await cartModel.findByIdAndUpdate(cid, cart);

    return { updatedByMongo, cartUpdated: cart };
  };

  addToCart = async (cid, pid) => {
    const data = await cartModel.findById(cid).lean().exec();

    if (!data) throw `Dind´t found the cart with id: ${cid}`;
    // const existProd = await productManagerDb.getProductsById( pid )
    // const existProd = await ProductService.getById(pid);
    const existProd = await this.productsDAO.getById(pid);
    if (!existProd) throw `Dind´t found the product id: ${pid}`;

    let cart = JSON.parse(JSON.stringify(data, null, 2));
    const prodIndex = cart.products.findIndex((p) => p.pId === pid);

    if (prodIndex > -1) {
      cart.products[prodIndex].quantity++;
    } else {
      cart.products.push({ pId: pid, quantity: 1 });
    }
    const addToCartByMongo = await cartModel.updateOne({ _id: cid }, cart);
    return { addToCartByMongo, cartAdded: cart };
  };

  delete = async (cid) => {
    // const cartDeleted = await cartModel.findByIdAndDelete(cid);
    const cart = await cartModel.findById(cid);
    if (!cart) throw `Did not found CID: ${cid}`;
    cart.products = [];
    const cartDeleted = await cartModel.findByIdAndUpdate(cid, cart);
    if (!cartDeleted)
      throw { httpError: 404, desc: `${cid} not found this cart` };
    return cartDeleted;
  };

  deleteProdById = async (cid, pid) => {
    //! HANDLE ERRORS
    const cartToUpdate = await cartModel.findById(cid).lean().exec();
    if (!cartToUpdate)
      throw { httpError: 404, desc: `The cartId : ${cid} was not found ` };
    // const product = await productManagerDb.getProductsById( pid );
    // const product = await ProductService.getById(pid);
    const product = await this.productsDAO.getById(pid);
    if (!product)
      throw { httpError: 404, desc: `The productId : ${pid} was not found` };
    const data = JSON.parse(JSON.stringify(cartToUpdate, null, 2));
    const isProdInCart = data.products.some((p) => p.pId === pid);
    if (!isProdInCart)
      throw {
        httpError: 404,
        desc: `The productId : ${pid} was not found inside the cart`,
      };

    //? SOLUTION
    const updateCart = data.products.filter((p) => {
      return p.pId !== pid;
    });
    cartToUpdate.products = updateCart;
    const updatedByMongo = await cartModel.findOneAndUpdate(
      { _id: cid },
      cartToUpdate
    );

    return { updatedByMongo, cartToUpdate };
  };
}
