import fs from 'fs';


export class ProductsFile {
    #_path;
    constructor( path ){
        this.#_path = path;
    }

    async #prodJSON( product, productsReady ){
        if ( productsReady ){
            await fs.promises.writeFile( this.#_path, JSON.stringify( productsReady, null, 2 ))
            return productsReady;
        }
        const isProducts = fs.existsSync(this.#_path);
        let products = []
        if( isProducts ) {
            let data = await fs.promises.readFile( this.#_path, "utf-8")
            products = [...JSON.parse( data )]
        }
        if( product ) products.push( product )
        await fs.promises.writeFile(this.#_path, JSON.stringify(products, null, 2) )
    
        return products
    }

    getAll = async() => await this.#prodJSON();

    getById = async( id ) => {
        const products = await this.#prodJSON()
        const product = products.find( p => p.code === id )
        if ( !product ) throw `DIN´T FOUND A PRODUCT WITH ID: ${ id }`

        return product
    }

    getByCode = async( code ) => {
        const products = await this.#prodJSON()
        const product = products.find( p => p.code === code.toString() )
        if ( !product ) throw `DIN´T FOUND A PRODUCT WITH CODE: ${ code }`

        return product
    }

    getAllPaginate = async(req, PORT) => {

    }

    async create( product ){
        const { id, title, description, price, thumbnail, code, stock, category, status=true } = product
        if ( id ) throw "Don't try to send an ID in the body, because it will be auto-incremented";
        if ( !title || !description || !price || !code || !stock || !category ) throw 'Must submit all required fields'
        if( typeof price !== 'number' || typeof stock !== 'number' || typeof status !== 'boolean' ) throw 'Must send a the correct type for each field'
        const products = await this.#prodJSON()
        if (products.some( p => p.code === code )) throw `Code: ${ code } must be unique, now is repetead!`;

        product.thumbnail = thumbnail.length === 0 ? ["Sin Imagen"] : thumbnail;
        product.status = status
        product.id = await this.generateId()
        await this.#prodJSON( product )
        return product
    }
    
    async update( id, product ){
        //! ERROR HANDLER
        const { title, description, price, thumbnail, code, stock, category, status=true } = product
        if ( product.id ) throw 'Don´t have to send an ID in the body petition'
        if ( !id || ( !title && !description && !price && !thumbnail && !code && !stock && !category ) ) throw 'Must be an ID and property to change like => {stock:222, description: "Hello World"}'
        const products = await this.#prodJSON();
        const indexProd = products.findIndex( p => p.id === id )
        if ( indexProd  < 0 ) throw `Din't found the ID: ${ id }`
        const isRepeteadCode = products.some( p => p.code === code )  
        if ( isRepeteadCode ) throw `Code must be unique: ${ code }`
        
        //? SOULUTION
        for ( const prop in products[indexProd] ) {
            products[indexProd][prop] = product[prop] ?? products[indexProd][prop]
        }

        await this.#prodJSON( null, products )
        return products
    }

    async deleteById( id ) {
        let products = await this.getProducts()
        if ( !products.some( p => p.id === id )) throw `ID: ${ id } not found`;

        products = products.filter( p => p.id !== id )
        await this.#prodJSON( null, products )
        return products;
    }

    async generateId (){
        const products = await this.#prodJSON()
        return products.at(-1)?.id + 1 || 1;
    }
}