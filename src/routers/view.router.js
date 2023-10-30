import passport from "passport";

import MyRouter from "./router.js";
import { ProductManagerDB } from "../dao/db/products_managerDB.js";
import { getProducts } from "./products.router.js";

import { getCarts } from "./cart.router.js";

const productsManagerDB = new ProductManagerDB();



export default class ViewRouter extends MyRouter {
  init() {
    
    //! LOGIN
    this.get('/', async( req, res ) => {
      try{
        console.log()
        res.clearCookie('jwt-coder').render('authenticate/login', { userRegister: false })
      } catch (err){
        res.render('errors/errorAuth', { error: err })
      }
    })

    this.get('/register', async( req, res ) => {
      try{
        res.render('authenticate/register')
      } catch (err){
        res.render('errors/errorAuth', { error: err })
      }
    })

    //! PRODUCTS
    this.get("/products", passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  async ( req, res ) => {

      try{
        const result = await getProducts( req, res )
        const { first_name, last_name, email, age, role, cart } = req.user;

        res.render("home", { 
          products: result.payload,
          prevLink: result.prevLink,
          nextLink: result.nextLink,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          page: result.page,
          user: {first_name, last_name, email, age, role, cart},
          isAdmin: req.user.role === 'admin'
        });

      } catch (err){
        res.render('errors/errorPlatform', { error: err })
      }
    });

    this.get("/products/realtimeproducts", passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async ( req, res ) => {
      try{
        const products = await productsManagerDB.getProducts();
        res.render("realTimeProducts", { products });
      }catch (err){
        res.render('errors/errorPlatform', { error: err })
      }
    });

    //! CARTS
    this.get('/carts/:cid', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async( req, res ) => {
      try{
        const dataCart = await getCarts( req, res );
        const cart = JSON.parse(JSON.stringify( dataCart ));
        const products = cart.products.map( p => {
          const prod = {...p.pId, quantity: p.quantity}
          return prod;
        })
        
        res.render('cart', { cartId: cart._id, products })
      } catch (err) {
        res.render('errors/errorPlatform', { error: err })
      }
    })

    //! CHATS
    this.get('/chat', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async( req, res ) => {
      try{
        res.render('chat')
      }catch (err){
        res.render('errors/errorPlatform', { error: err })
      }
    })

    //! PROFILE
    this.get('/profile', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  async( req, res ) => {
      try{

        const { first_name, last_name, email, age, cart, role } = req.user;
        res.render( 'authenticate/profile', {
          first_name,
          last_name,
          email,
          age,
          role,
          isUser: role === 'user',
          cartId: cart
        })
      } catch (err){
        res.render('errors/errorAuth', { error: err })
      }
    })

    this.get('/failToken', ( req, res ) => res.clearCookie('jwt-coder').render('errors/errorAuth',{error: 'Error to Authenticate'}))
    
  }
}
