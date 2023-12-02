import { productModel } from "../../models/Product.js";
import { CustomError, EErros, ErrorInfoProd, ErrorInfoGetByCode, ErrorInfoGetById } from "../../service/errors/index.js";


export default class ProductsMongo {

    getAll = async() => {
        const products = await productModel.find().lean().exec();
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

        const { docs, totalPages, prevPage, nextPage, page: pagePaginate, hasPrevPage, hasNextPage } = await productModel.paginate( filterOption, paginateOption );
        
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

        if ( prevPage === 1 && !originalUrl.includes('&')) {
            const cleanEndPoint = originalUrl.replace(`?page=${page}`, '')
            prevLink = `http://${ req.hostname}:${PORT}${cleanEndPoint}`
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

    getById = async( id ) => {
        let prod;
        try{
            prod = await productModel.findById({ _id: id }).lean().exec();
        } catch( error ) {
            // console.log( error )
            CustomError.createError({
                name: 'Product Get Id Error',
                cause: ErrorInfoGetById(  id ),
                message: 'Error while trying to get a product with the correct id',
                code: EErros.INVALID_TYPES_ERROR
            })
        }
        return prod;
    }

    getByCode = async( code ) => {
        const product = await productModel.findOne({ code: code }).lean().exec();

        if( !product ) {
            CustomError.createError({
                name: 'Product get Code Error',
                cause: ErrorInfoGetByCode( code ),
                message: 'Error while trying to get a code',
                code: EErros.INVALID_TYPES_ERROR
            })
        }
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
        const product = { title, description, price, code, stock, category, status, thumbnail }
        if ( !title || !description || !price || !code || !stock || !category ) {
            CustomError.createError({
                name: 'Product create Error',
                cause: ErrorInfoProd( product ),
                message: 'Error while trying to create a product',
                code: EErros.INVALID_TYPES_ERROR
            })
        }
        product.thumbnail = thumbnail.length === 0 ? ["Without image"] : thumbnail;
        product.status = status

        const productGenerated = new productModel( product )
        
        await productGenerated.save()

    }

    update = async( id, product ) =>  await productModel.findByIdAndUpdate( id, product, { returnDocument: 'after' } );

    deleteById = async( id ) => await productModel.findByIdAndDelete( id );

}