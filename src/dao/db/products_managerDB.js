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

    isProductsByCode = async( code ) => {
        const product = await productsModel.findOne({ code: code }).lean().exec();
        product._id = product._id.toString();
        return product
    }

    getProductsById = async( id ) => await productsModel.findById({ _id: id });

    updateProduct = async( id, product ) =>  await productsModel.findByIdAndUpdate( id, product );

    deleteProduct = async( id ) => await productsModel.findByIdAndDelete( id );

}