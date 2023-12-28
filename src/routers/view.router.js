import passport from "passport";

import MyRouter from "./router.js";
import { viewController } from "../controllers/index.js";
// import { forgetPassword, recoveryPassword } from "../controllers/checkoutController.js";




export default class ViewRouter extends MyRouter {
  init() {
    
    //? LOGIN
    this.get('/', ['PUBLIC'], viewController.login)

    this.get('/register', ['PUBLIC'], viewController.register)

    this.get('/forget-password', ['PUBLIC'], viewController.forgetPassword )

    this.post('/recovery', ['PUBLIC'], viewController.recoveryPassword)

    this.get('/verify-token/:passToken', ['PUBLIC'], viewController.verifyToken )

    //? PRODUCTS
    this.get("/products", ['USER','ADMIN','PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  viewController.products);

    this.get("/products/realtimeproducts", ['ADMIN','PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.realTimeProducts);

    //? CARTS
    this.get('/carts/:cid', ['USER','PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.cartId )

    //? CHATS
    this.get('/chat', ['USER','PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.chat)

    //? PROFILE
    this.get('/profile', ['USER','ADMIN','PREMIUM'], passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), viewController.profile)

    this.get('/failToken', ['PUBLIC'], viewController.failToken)
    
  }
}
