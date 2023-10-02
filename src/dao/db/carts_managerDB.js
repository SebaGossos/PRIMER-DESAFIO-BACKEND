import cartModel from '../models/carts.models.js';
import { ProductManagerDB } from './products_managerDB.js';

const productManagerDb = new ProductManagerDB()

export class CartManagerDB{

    createCart = async () => await cartModel.create({ products:[] });
    
    getCarts = async() => await cartModel.find().lean().exec();
    
    getCartById = async ( id ) => await cartModel.findById( id ).populate('products.pId');
    
    async addToCart( cid, pid ){

        const data = await cartModel.findById( cid ).lean().exec();
        if( !data ) throw `Dind´t found the cart with id: ${cid}`;
        const existProd = await productManagerDb.getProductsById( pid )
        if ( !existProd ) throw `Dind´t found the product id: ${pid}`;
        
        let cart = JSON.parse(JSON.stringify( data, null, 2));
        const prodIndex = cart.products.findIndex( p => p.pId === pid );

        if ( prodIndex > -1 ) {
            cart.products[prodIndex].quantity++;
        } else {
            cart.products.push({ pId: pid, quantity: 1 });
        }

        const addToCartByMongo = await cartModel.updateOne({_id: cid}, cart)
        return { addToCartByMongo, cartAdded: cart }
        
    }

    async updateCart( cid, change ){
        //! HANDLE ERRORS
        const data = await cartModel.findById( cid ).populate('products.pId');
        if ( !data ) throw { httpError: 404 , desc:`The cartId : ${ cid } was not found` }
        let products = change.products;
        if ( !products ) throw { httpError: 404 , desc:`Must send a products as property, not: ${ change.products }` }
        products = await Promise.all(products.map ( async p => {
            if ( !p.pId || typeof p.quantity === 'undefined') throw { httpError: 400 , desc:`Must send a product with pId and quantity as property, not: ${ p.pId && p.quantity }` }
            const product = await productManagerDb.getProductsById( p.pId );
            if ( !product ) throw { httpError: 404 , desc:`The productId : ${ pid } was not found` }
            if ( typeof p.quantity !== 'number' || p.quantity < 1 ) throw { httpError: 400 , desc:`Quantity from product must be a number greater than: ${ p.quantity }` }
            return p
        }))

        data.products = products;
        console.log( data )

        //? SOLUTION
        
        const updatedByMongo = await cartModel.findByIdAndUpdate( cid, data );
        
        return { updatedByMongo, cartUpdated:data }


    }
    

    deleteProductByCart = async ( cid, pid ) => {
        //! HANDLE ERRORS
        const cartToUpdate = await cartModel.findById( cid ).lean().exec();
        if ( !cartToUpdate ) throw { httpError: 404 , desc:`The cartId : ${ cid } was not found ` }
        const product = await productManagerDb.getProductsById( pid );
        if ( !product ) throw { httpError: 404 , desc:`The productId : ${ pid } was not found` }
        const data = JSON.parse( JSON.stringify(cartToUpdate, null, 2) )
        const isProdInCart = data.products.some( p => p.pId === pid );
        if( !isProdInCart ) throw { httpError: 404 , desc:`The productId : ${ pid } was not found inside the cart` };

        //? SOLUTION
        const updateCart = data.products.filter( p => {
            return p.pId !== pid;
        })
        cartToUpdate.products = updateCart

        const updatedByMongo = await cartModel.findOneAndUpdate({ _id:cid }, cartToUpdate )

        return { updatedByMongo, cartToUpdate };
    };
    
    deleteProductsByCart = async ( id ) => {
        await cartModel.findByIdAndDelete( id )

        return 0;
    };
    
}