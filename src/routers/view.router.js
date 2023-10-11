import { Router } from "express";
import { getProducts } from "./products.router.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";
import { getCarts } from "./cart.router.js";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// const productsManagerFS = new ProductManagerFS(routProductJSON);


const productsManagerDB = new ProductManagerDB();

const router = Router();

//! LOGIN
router.get('/', privateRoutes, async( req, res ) => {
  try{
    const isNotUser = req.session.isNotUser;
    if( isNotUser ) return res.render('session/login', { isNotUser })
    res.render('session/login', { isNotUser: false })
  } catch (err){
    res.render('errors/errorSession', { error: err })
  }
})

router.get('/register', async( req, res ) => {
  try{
    res.render('session/register')
  } catch (err){
    res.render('errors/errorSession', { error: err })
  }
})

router.get('/profile', publicRoutes, async( req, res ) => {
  try{
    res.render('session/profile', req.session.user)
  } catch (err){
    res.render('errors/errorSession', { error: err })
  }
})
 




//! PRODUCTS
router.get("/products", publicRoutes, async ( req, res ) => {

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
      user: req.session.user,
      isAdmin: req.session.user.role === 'admin'
    });

  } catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

router.get("/products/realtimeproducts", publicRoutes, async ( req, res ) => {
  try{
    const products = await productsManagerDB.getProducts();
    res.render("realTimeProducts", { products });
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
});

//! CARTS
router.get('/carts/:cid', publicRoutes, async( req, res ) => {
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
router.get('/chat', publicRoutes, async( req, res ) => {
  try{
    res.render('chat')
  }catch (err){
    res.render('errors/errorPlatform', { error: err })
  }
})



export default router;
