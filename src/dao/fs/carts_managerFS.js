import fs from 'fs'


export class Carts_managerFS{
    #pathCartJSON;
    #pathProductsJSON

    constructor( pathCartJSON, pathProductsJSON='' ){
        this.#pathCartJSON = pathCartJSON;
        this.#pathProductsJSON = pathProductsJSON
        this.#init()
    }

    async #init(){
        //? CREA UN [] EN EL FILE SI NO EXISTE 
        if ( !fs.existsSync( this.#pathCartJSON ) ) return await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify([], null, 2) )
        //? CREA UN [] SI ES UN ARCHIVO VACIO 
        const data = await fs.promises.readFile( this.#pathCartJSON, 'utf-8')
        if ( ( data.length === 0 ) ) return await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify([], null, 2) )
        //? REESCRIBE UN [] EN EL FILE SI ES OTRO TIPO DE DATO QUE NO SEA UN ARRAY
        if( data.length > 0 ) {
            const carts = JSON.parse( data );
            if( !Array.isArray(carts) ) return await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify([], null, 2) )
        }
    }

    async #createId(){
        const cart = JSON.parse(await fs.promises.readFile(this.#pathCartJSON, 'utf-8'));
        return cart[cart.length - 1]?.id + 1 || 1; 
    } 

    async createCart(){
        const cart = JSON.parse( await fs.promises.readFile(this.#pathCartJSON, 'utf-8') );
        cart.push({
            id: await this.#createId(),
            product: []
        })
        
        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify( cart, null, 2 ) )
        return cart;
    }

    // async updateCart( id, change ){

    //     const cartProducts = this.getCartById( id ).product;

    //     for (const prop in cartProducts ){
    //         cartProducts[prop] = change[prop] ?? cartProducts[prop]
    //     }
        
    //     // const newProd = {
    //     //     ...cart,
    //     //     ...change
    //     // }
    //     const carts = await fs.promises.readFile( this.#pathCartJSON, 'utf-8' )
    //                           .map( cart => {
    //                             if ( cart.id === id  ) return newProd
    //                             return cart;
    //                           })

    //     await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify( carts, null, 2 ) )
    //     return carts
    // }
    
    async addToCart( cid, pid ){
        //? ERRORS HANDLER
        const carts = JSON.parse(await fs.promises.readFile(this.#pathCartJSON, 'utf-8'));
        const cartIndex = carts.findIndex( cart => cart.id === cid );
        if ( cartIndex < 0 ) throw `Din't found the CartID: ${ cid }`

        const isProducts = JSON.parse(await fs.promises.readFile( this.#pathProductsJSON, 'utf-8' ))
                               .findIndex( p => p.id === pid );
        if ( isProducts < 0 ) throw `Din't found the ProductID: ${ pid }`
        

        const productCart = carts[ cartIndex ].product;
        const productIndex = productCart.findIndex( p => p.id === pid );

        if ( productIndex < 0 ) {
            productCart.push({
                id: pid,
                quantity: 1
            }) 
            carts[ cartIndex ].product = productCart;
            await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify(carts, null, 2))
            return productCart
        }
        
        productCart[productIndex].quantity += 1;
        carts[ cartIndex ].product = productCart;
        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify(carts, null, 2))
        return productCart
    }

    getCartById = async ( id ) => {
        const cart = JSON.parse( await fs.promises.readFile( this.#pathCartJSON, 'utf-8' ) )
                         .find( cart => cart.id === id )
        
        if( !cart ) throw `Din´t found ID: ${ id }`;
        return cart;
    };
}