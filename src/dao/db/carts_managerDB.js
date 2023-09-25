import cartModel from '../models/carts.models.js';
import { ProductManagerDB } from './products_managerDB.js';

const productManagerDb = new ProductManagerDB()

export class CartManagerDB{

    getCarts = async() => await cartModel.find().lean().exec();
    
    getCartById = async ( id ) => await cartModel.findById( id );

    createCart = async () => await cartModel.create({ products:[] });
    
    async addToCart( cid, pid ){
        // const data = await cartModel.findOne({ _id: cid }).populate('products.pId');
        const data = await this.getCartById( cid );
        if( !data ) throw `Dind´t found the cart with id: ${cid}`;
        const existProd = await productManagerDb.getProductsById( pid )
        if ( !existProd ) throw `Dind´t found the product id: ${pid}`;
        
        let cart = JSON.parse(JSON.stringify( data, null, 2));
        
        const prodIndex = cart.products.findIndex( p => p.pId === pid )
        cart.products[prodIndex].quantity++

        const addCart = await cartModel.updateOne({_id: cid}, cart)
        return addCart
        
    }

    async updateCart( cid, change ){
        const data = await cartModel.findOne({ _id: cid }).populate('products.pId');
        const cart = JSON.parse(JSON.stringify( data, null, 2))
        cart.products.map( p => {
            if( p.pId === pid ){
                return p.quantity++
            }
            return p
        })
        console.log( cart )

        return cart
    }
    

    deleteCart = async ( id ) => await cartModel.findByIdAndDelete( id );
    
}