import productsModel from "../models/products.models.js";

export default class ProductsMongo {

    getAll = async() => {
        const products = await productsModel.find().lean().exec();
        const productsWithIdAsString = products.map( p => {
            p._id = p._id.toString();
            return p;
        })
        return productsWithIdAsString; 
    }

    getAllPaginate = async( req, PORT ) => {

        const { limit=10, page=1, sort, stock, category } = req.query;
        
        //! HANDLE ERRORS
        const optCategory=['Agua', 'Jugo', 'Gaseosa']
        
        if( stock !== undefined && isNaN( Number( stock ) ) ) throw `Must send a valid stock not: ${ stock }`
        if ( category !== undefined && !optCategory.includes( category ) ) throw `Must send a valid Category between 'Agua', 'Jugo', 'Gaseosa'. Not: ${ category }`

        if( isNaN( Number( limit ) ) || limit[0] === '-' ) throw `Must send a valid limit not: ${ limit }`
        if( isNaN( Number( page ) ) || page[0] === '-') throw `Must send a valid page not: ${ page }`
        if( sort !== undefined && sort !== 'asc' && sort !== 'desc' ) throw `Must send a valid sort between 'asc' or 'desc' not: ${ sort }`
        
        //? SOLUTION
        const paginateOption = { lean: true, limit, page }
        if ( sort ) paginateOption.sort = { price: (sort==='asc') ? 1 : -1 };

        const filterOption = {}
        if ( stock ) filterOption.stock = stock;
        if ( category ) filterOption.category = category;
        
        const response = await this.#paginate( req, PORT, filterOption, paginateOption )
        return response;
    }
    
    #paginate = async( req, PORT, filterOption, paginateOption ) => {

        const { limit, page, sort, stock, category } = req.query;

        const { docs, totalPages, prevPage, nextPage, page: pagePaginate, hasPrevPage, hasNextPage } = await productsModel.paginate( filterOption, paginateOption );
        
        //! HANDLE ERROR
        if ( totalPages < page ) throw `Must submit a page until: ${ totalPages }`

        const originalUrl = req.originalUrl.at(-1) === '/' ? req.originalUrl.pop() : req.originalUrl;

        const andOrQuestion = originalUrl === '/products' ? '?' : '&';

        let prevLink;
        if ( !page ){
            prevLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${prevPage}`;
        } else {
            const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${prevPage}`);
            prevLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
        }

        let nextLink
        if ( !page ){
            nextLink = `http://${req.hostname}:${PORT}${originalUrl}${andOrQuestion}page=${nextPage}`;
        } else {
            const modifyLink = originalUrl.replace(`page=${req.query.page}`,`page=${nextPage}`);
            nextLink = `http://${ req.hostname }:${PORT}${modifyLink}`;
        }
        
        return {
            status: 'success',
            payload: docs,
            page: pagePaginate,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };
    }

    getById = async( id ) => await productsModel.findById({ _id: id });

    getByCode = async( code ) => {
        const product = await productsModel.findOne({ code: code }).lean().exec();
        if( !product ) throw `Dind´t found the product with code: ${ code }.`
        product._id = product._id.toString();
        return product
    }

    async create({
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

    update = async( id, product ) =>  await productsModel.findByIdAndUpdate( id, product, { returnDocument: 'after' } );

    deleteById = async( id ) => await productsModel.findByIdAndDelete( id );

}