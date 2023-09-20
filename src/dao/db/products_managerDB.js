import productsModel from '../models/products.models.js';

export class ProductManagerDB {

    getProducts = async() => await productsModel.find().lean().exec();


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
        productsModel.find()//TODO: UPDATE PRODUCT
    }

    async deleteProduct( id ) {
        productsModel.deleteOne() //TODO: DELETE PRODUCT
    }
}