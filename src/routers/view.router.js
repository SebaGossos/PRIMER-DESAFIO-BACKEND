import { Router } from "express";
import { getProducts } from "./products.router.js";

import { ProductManagerDB } from "../dao/db/products_managerDB.js";
import { getCarts } from "./cart.router.js";

// import { routProductJSON } from "../routesJSON/routes.js";
// import { ProductManagerFS } from "../dao/fs/products_managerFS.js";
// const productsManagerFS = new ProductManagerFS(routProductJSON);


const productsManagerDB = new ProductManagerDB();

const router = Router();

//! LOGIN
router.get('/', async( req, res ) => {
  res.render('session/login')
})

router.get('/register', async( req, res ) => {
  res.render('session/register')
})

router.get('/profile', async( req, res ) => {
  res.render('session/profile', req.session.user)
})
 












//! PRODUCTS
router.get("/products", async ( req, res ) => {
  const result = await getProducts( req, res )
  // const products = await productsManagerDB.getProducts()
  res.render("home", { 
    products: result.payload,
    prevLink: result.prevLink,
    nextLink: result.nextLink,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    page: result.page,
    user: req.session.user
  });
});

router.get("/products/realtimeproducts", async ( req, res ) => {
  const products = await productsManagerDB.getProducts();
  res.render("realTimeProducts", { products });
});

//! CARTS
router.get('/carts/:cid', async( req, res ) => {
  try{
    const dataCart = await getCarts( req, res );
    const cart = JSON.parse(JSON.stringify( dataCart ));
    const products = cart.products.map( p => p.pId )
    console.log( products )
    res.render('cart', { cartId: cart._id, products })
  } catch(err) {
    res.send(500).json({ status: 'error', error: err })
  }

})

//! CHATS
router.get('/chat', async( req, res ) => {
  res.render('chat')
})



export default router;
