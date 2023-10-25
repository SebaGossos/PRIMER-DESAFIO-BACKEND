import { Router } from "express";
import { getProducts } from "./products.router.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";

import { getCarts } from "./cart.router.js";
import { authToken } from "../utils.js";

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
    res.render('errors/errorSession', { error: err })
  }
})

router.get('/register', async( req, res ) => {
  try{
    res.render('authenticate/register')
  } catch (err){
    res.render('errors/errorSession', { error: err })
  }
})

router.get('/profile',  async( req, res ) => {
  try{
    // res.render('authenticate/profile', req.authenticate.user)
    res.render('authenticate/profile', {})
  } catch (err){
    res.render('errors/errorSession', { error: err })
  }
})




//! PRODUCTS
router.get("/products", authToken,  async ( req, res ) => {

  try{
    const result = await getProducts( req, res )
    // const products = await productsManagerDB.getProducts()
    res.render("home", { 
      products: result.payload,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      page: result.page,
      // user: req.authenticate.user,
      // isAdmin: req.authenticate.user.role === 'admin'
    });

  } catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

router.get("/products/realtimeproducts",  async ( req, res ) => {
  try{
    const products = await productsManagerDB.getProducts();
    res.render("realTimeProducts", { products });
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

//! CARTS
router.get('/carts/:cid', async( req, res ) => {
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
router.get('/chat', async( req, res ) => {
  try{
    res.render('chat')
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
})



export default router;
