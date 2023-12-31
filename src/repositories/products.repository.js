export default class ProductRepository {
    
    constructor( dao ){
        this.dao = dao;
    }

    getAll = async() => await this.dao.getAll()
    getById = async( id ) => await this.dao.getById( id )
    getByCode = async( code ) => await this.dao.getByCode( code );
    getAllPaginate = async( req, PORT ) => await this.dao.getAllPaginate( req, PORT )
    create = async( data ) => await this.dao.create( data )
    update = async( id, data ) => await this.dao.update( id, data )
    deleteById = async( id ) => await this.dao.deleteById( id )
    
}