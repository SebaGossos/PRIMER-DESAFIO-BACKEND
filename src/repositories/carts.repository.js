export default class CartRepository{

    constructor( dao ){
        this.dao = dao;
    }

    getAll = async() => await this.dao.getAll();
    getById = async( cid ) => await this.dao.getById( cid );

    create = async( email ) => await this.dao.create( email );

    update = async( cid, data ) => await this.dao.update( cid, data )
    updateQuantity = async( cid, data ) => await this.dao.updateQuantity( cid, data ) 
    addToCart = async( cid, data ) => await this.dao.addToCart( cid, data );

    delete = async( cid ) => await this.dao.delete( cid )
    deleteByEmail = async( email ) => await this.dao.deleteByEmail( email )
    deleteProdById = async ( cid, data ) => await this.dao.deleteProdById( cid, data )
    
}