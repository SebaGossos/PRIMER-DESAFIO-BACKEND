import productsModel from '../models/products.models.js';

export class ProductManagerDB {

    //TODO: CHANGE NAME BECAUSE IS REPETEAD WITH THE PRODUCT ROUTER
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

    paginate = async( { stock, category }, { limit=10, page=1, sort } ) => {
        //! HANDLE ERRORS
        const optCategory=['Agua', 'Jugo', 'Gaseosa']
        
        if( stock !== undefined && isNaN( Number( stock ) ) ) throw `Must send a valid stock not: ${ stock }`
        if ( category !== undefined && !optCategory.includes( category ) ) throw `Must send a valid Category between 'Agua', 'Jugo', 'Gaseosa'. Not: ${ category }`

        if( isNaN( Number( limit ) ) ) throw `Must send a valid limit not: ${ limit }`
        if( isNaN( Number( page ) ) ) throw `Must send a valid page not: ${ page }`
        if( sort !== undefined && sort !== 'asc' && sort !== 'desc' ) throw `Must send a valid sort between 'asc' or 'desc' not: ${ sort }`
        
        //? SOLUTION
        const paginateOption = { lean: true, limit, page }
        if ( sort ) paginateOption.sort = { price: (sort==='asc') ? 1 : -1 };

        const filterOption = {}
        if ( stock ) filterOption.stock = stock;
        if ( category ) filterOption.category = category;
        
        const res = await productsModel.paginate( filterOption, paginateOption )
        return res;
    }

    getProductsById = async( id ) => await productsModel.findById({ _id: id });

    updateProduct = async( id, product ) =>  await productsModel.findByIdAndUpdate( id, product );

    deleteProduct = async( id ) => await productsModel.findByIdAndDelete( id );

}