import { Router } from "express";
import { getProducts } from "./products.router.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

import { getCarts } from "./cart.router.js";
import { authToken } from "../utils.js";

import passport from "passport";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// const productsManagerFS = new ProductManagerFS(routProductJSON);


const productsManagerDB = new ProductManagerDB();

const router = Router();

//! LOGIN
router.get('/', async( req, res ) => {
  try{
    // const isNotUser = req.authenticate.isNotUser;

    // const userRegister = req.authenticate.passport;

    // if ( userRegister ) {

    //   return res.render('authenticate/login', { userRegister: true })
    // }
    // if( isNotUser ) return res.render('authenticate/login', { isNotUser })
    res.render('authenticate/login', { userRegister: false })
  } catch (err){
    res.render('errors/errorAuth', { error: err })
  }
})

router.get('/register', async( req, res ) => {
  try{
    res.render('authenticate/register')
  } catch (err){
    res.render('errors/errorAuth', { error: err })
  }
})

router.get('/profile', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  async( req, res ) => {
  try{
    console.log( req.user )
    // res.render('authenticate/profile', req.authenticate.user)
    const { first_name, last_name, email, age, role } = req.user;
    res.render( 'authenticate/profile', {
      first_name,
      last_name,
      email,
      age,
      role
    } )
  } catch (err){
    res.render('errors/errorAuth', { error: err })
  }
})


//! PRODUCTS
router.get("/products", passport.authenticate('jwt', { failureRedirect:'failToken', session: false}),  async ( req, res ) => {

  try{
    const result = await getProducts( req, res )

    console.log(req.user)
    // const products = await productsManagerDB.getProducts()
    res.render("home", { 
      products: result.payload,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      page: result.page,
      user: req.user,
      isAdmin: req.user.role === 'admin'
    });

  } catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

router.get("/products/realtimeproducts", passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async ( req, res ) => {
  try{
    const products = await productsManagerDB.getProducts();
    res.render("realTimeProducts", { products });
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

//! CARTS
router.get('/carts/:cid', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async( req, res ) => {
  try{
    const dataCart = await getCarts( req, res );
    const cart = JSON.parse(JSON.stringify( dataCart ));
    const products = cart.products.map( p => p.pId )
    
    res.render('cart', { cartId: cart._id, products })
  } catch (err) {
    res.render('errors/errorPlatform', {error: err})
  }
})

//! CHATS
router.get('/chat', passport.authenticate('jwt', { failureRedirect:'failToken', session: false}), async( req, res ) => {
  try{
    res.render('chat')
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
})



router.get('/failToken', ( req, res ) => res.clearCookie('jwt-coder').render('errors/errorAuth',{error: 'Error to Authenticate'}))

export default router;
