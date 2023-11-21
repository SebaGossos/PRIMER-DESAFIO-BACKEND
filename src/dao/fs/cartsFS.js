import fs from 'fs'


export class CartsFile{
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

    getAll = async() => JSON.parse(await fs.promises.readFile( this.#pathCartJSON, 'utf-8' ))
    getById = async( id ) => {
        return JSON.parse( await fs.promises.readFile( this.#pathCartJSON, 'utf-8' ) )
                   .find( cart => cart.id === id )
    }

    create = async( cart={} ) => {
        const carts = JSON.parse(await fs.promises.readFile( this.#pathCartJSON, 'utf-8' ));

        cart.id = carts.length;
        cart.product = []
        cart.quantity = 0

        carts.push( cart )
        
        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify( carts, null, 2) )

        return carts;
    } 

    update = async( id, data ) => {
        const carts = JSON.parse( await fs.promises.readFile( this.#pathCartJSON ) )
        const cartIndex = carts.findIndex( cart => cart.id === id )
        console.log( cartIndex )
        if( cartIndex < 0 ) throw `cart not found ${ id }`;

        let cart = carts[ cartIndex ];

        carts[ cartIndex ] = { ...cart, ...data }
        carts[ cartIndex ].quantity = carts[ cartIndex ].product.length

        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify( carts, null, 2 ) )
        
        return cart
        
    }

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

    delete = async (cid) => {
        const carts = JSON.parse( await fs.promises.readFile(this.#pathCartJSON, 'utf-8') )
        const cartIndex = carts.findIndex( cart => cart.id === cid )
        if ( cartIndex < 0 ) throw `Din't found the CartID: ${ cid }`

        carts[ cartIndex ].product = []
        carts[ cartIndex ].quantity = 0
        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify(carts, null, 2))

        return carts[ cartIndex ]
    };

    deleteProdById = async (cid, pid) => {

        const carts = JSON.parse(await fs.promises.readFile(this.#pathCartJSON, 'utf-8'));
        const cartIndex = carts.findIndex( cart => cart.id === cid );
        if ( cartIndex < 0 ) throw `Din't found the CartID: ${ cid }`

        const isProducts = JSON.parse(await fs.promises.readFile( this.#pathProductsJSON, 'utf-8' ))
                               .findIndex( p => p.id === pid );
        if ( isProducts < 0 ) throw `Din't found the ProductID: ${ pid }`

        const productCart = carts[ cartIndex ].product;
        const productIndex = productCart.findIndex( p => p.id === pid );

        if ( productIndex < 0 ) throw `Din't found the Product inside Cart: ${ cid }` 

        carts[ cartIndex ].product = productCart.filter( p => p.id !== pid )

        
        await fs.promises.writeFile( this.#pathCartJSON, JSON.stringify(carts, null, 2))

        
        return productCart
        
    };

}