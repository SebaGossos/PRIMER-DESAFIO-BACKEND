import passport from "passport";

import MyRouter from "./router.js";
import { ProductManagerDB } from "../dao/db/products_managerDB.js";
const productsManagerDB = new ProductManagerDB();

import { getProducts } from "./products.router.js";
import { getCarts } from "./cart.router.js";


import ViewController from "../controllers/viewController.js";
const viewController = new ViewController()



export default class ViewRouter extends MyRouter {
  init() {
    
    //? LOGIN
    this.get('/', ['PUBLIC'], viewController.login)

    this.get('/register', ['PUBLIC'], viewController.register)

    //? PRODUCTS
    this.get("/products", ['USER','ADMIN'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  viewController.products);

    this.get("/products/realtimeproducts", ['USER','ADMIN'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.realTimeProducts);

    //? CARTS
    this.get('/carts/:cid', ['USER','ADMIN'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.cartId )

    //? CHATS
    this.get('/chat', ['USER','ADMIN'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.chat)

    //? PROFILE
    this.get('/profile', ['USER','ADMIN'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.profile)

    this.get('/failToken', ['PUBLIC'], viewController.failToken)
    
  }
}
