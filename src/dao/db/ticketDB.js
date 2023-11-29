import { ticketModel } from "../../models/Ticket.js";
import { cartModel } from "../../models/Cart.js";
import { productModel } from "../../models/Product.js";
import { v4 as uuidv4 } from 'uuid'

export default class TicketMongo {

    #productsExist = async( cid ) => {

        const cart = await cartModel.findById( cid ).lean()
        if( !cart ) throw `Cart ${ cid } not found`
        const productsCart = []
        for ( let prod of cart.products ){

            const pId = prod.pId
            const product = await productModel.findById( pId ).lean().exec()
            if( !product ) throw `product ${ pId } not found`
            
            productsCart.push({ ...product, quantity: prod.quantity })
        }
        return productsCart
    }

    #stockAvailable = async( prodInCart ) => {
        const withStock = []
        const withoutStock = []
        for ( let prod of prodInCart ){
            const stock = prod.stock;
            const quantityToBuy = prod.quantity;

            if( stock >= quantityToBuy && quantityToBuy > 0 ) {
                withStock.push( prod )
            } else {
                withoutStock.push( prod )
            }
        }
        return  { withStock, withoutStock } 
    }

    #updateProdCart = async( products ) => {
        const productsUpdated = []
        const productPurchased = []
        let totalPriceCart = 0;

        for( const prod of products ){
            const reduceStock = prod.stock - prod.quantity;
            const updateQuantity = { ...prod, stock: reduceStock } 
            const { quantity, ...product } = updateQuantity;
            productsUpdated.push(product)
            const amount = prod.quantity * prod.price;
            totalPriceCart += amount
            productPurchased.push({ product: prod._id, price: prod.price, quantity: prod.quantity })
        }

        productPurchased.push({totalPriceCart})
        return { productsUpdated, productPurchased }
    }

    #changeInDB = async( products, productPurchased, email ) => {

        //! UPDATE PRODUCTS DB
        for( const prod of products ) {
            const id = prod._id;
            const something = await productModel.findByIdAndUpdate( id, prod, { returnDocument: 'after' } )
        }

        //! CREATE TICKET DB
        let cartPrice;
        const productsTicket = productPurchased.filter( prod => {
            if( prod.totalPriceCart || prod.totalPriceCart === 0 ) {
                cartPrice = prod.totalPriceCart
                return false
            }
            return true
        })
        const code = uuidv4()
        const ticket = {
            code,
            products: productsTicket,
            amount: cartPrice,
            purchaser: email,
        }

        const saveTicket = await ticketModel.create( ticket )

        return saveTicket;
    }

    purchase = async( cid, email ) => {
        const prodInCart = await this.#productsExist( cid )
        const { withStock, withoutStock } = await this.#stockAvailable( prodInCart )
        let response = { withoutStock }
        if( withStock.length > 0 ) {
            const { productsUpdated, productPurchased } = await this.#updateProdCart( withStock )
            const ticket = await this.#changeInDB(productsUpdated, productPurchased, email)
            response = { withoutStock, ticket }
        }
        return response;

    }

}