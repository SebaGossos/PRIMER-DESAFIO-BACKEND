import productsModel from '../models/products.models.js';

export class ProductManagerDB {

    getProducts = async() => {
        const products = await productsModel.find().lean().exec();
        const productsWithIdAsString = products.map( p => {
            p._id = p._id.toString();
            return p;
        })
        return productsWithIdAsString; 
    }


    async addProduct({
        title,
        description,
        price,
        code,
        stock,
        category,
        status=true,
        thumbnail=['Without image']
    }){
        if ( !title || !description || !price || !code || !stock || !category ) throw 'Must submit all required fields'
        const product = { title, description, price, code, stock, category, status, thumbnail }
        product.thumbnail = thumbnail.length === 0 ? ["Without image"] : thumbnail;
        product.status = status

        // productsModel.create( product )

        const productGenerated = new productsModel( product )
        await productGenerated.save()
    }


    getProductsById = async( id ) => {
        return await productsModel.findById({ _id: id })
    }
    
    async updateProduct( id, product){
        productsModel.findByIdAndUpdate()//TODO: UPDATE PRODUCT
    }

    async deleteProduct( id ) {
        console.log( 33, id)
        await productsModel.findByIdAndDelete( id ) //TODO: DELETE PRODUCT
    }
}