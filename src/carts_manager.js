import fs from 'fs'

// [
//     {
//         id:1,
//         products: [
//             {
//                 id:3,
//                 quantity: 2
//             },
//             {
//                 id:5,
//                 quantity: 4
//             }
//         ]
//     },
//     {
//         id:2,
//         products: [
//             {
//                 id:4,
//                 quantity: 7
//             },
//             {
//                 id:7,
//                 quantity: 3
//             }
//         ]
//     }
// ]

export class Carts_manager{
    #path;

    constructor( path ){
        this.#path = path;
        this.#init()
    }

    async #init(){
        const data = await fs.promises.readFile( this.#path, 'utf-8')
        //!CREA UN [] EN EL FILE SI NO EXISTE O SI ES UN ARCHIVO VACIO
        if ( !fs.existsSync( this.#path ) || ( data.length === 0 ) ) {
            return await fs.promises.writeFile( this.#path, JSON.stringify([], null, 2) )
        }
        //!REESCRIBE UN [] EN EL FILE SI ES OTRO TIPO DE DATO QUE NO SEA UN ARRAY
        if( data.length > 0 ) {
            const carts = JSON.parse( data );
            if( !Array.isArray(carts) ) return await fs.promises.writeFile( this.#path, JSON.stringify([], null, 2) )
        }
    }
 
    async #createId(){
        const cart = JSON.parse(await fs.promises.readFile(this.#path, 'utf-8'));
        return cart[cart.length - 1].id + 1 || 1; 
    }

    async addToCart( product, callback ){
        const cart = await fs.promises.readFile(this.#path, 'utf-8');
        
        cart.push({
            id: this.#createId(),
            product: []
        })

        return cart
    }

    async createCart(){
        const cart = JSON.parse( await fs.promises.readFile(this.#path, 'utf-8') );
        
        await cart.push({
            id: await this.#createId(),
            product: []
        })
        
        await fs.promises.writeFile( this.#path, JSON.stringify( cart, null, 2 ) )
        
        return cart;
    }

    async addToCart( product, callback ){
        const cart = await fs.promises.readFile(this.#path, 'utf-8');
        
        cart.push({
            id: await this.#createId(),
            product: []
        })

        
        return cart
    }
    
    
}