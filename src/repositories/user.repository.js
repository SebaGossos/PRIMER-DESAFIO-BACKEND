export default class UserRepository {
    constructor( dao ) {
        this.dao = dao;
    }

    getByEmail = async( email ) => await this.dao.getByEmail( email )
    getByEmailForLogin = async( email ) => await this.dao.getByEmail( email )
    create = async( user ) => await this.dao.create( user );
    createForRegister = async( user ) => await this.dao.createForRegister( user )
    findById = async( id ) => await this.dao.findById( id )
    update = async( email, data ) => await this.dao.update( email, data )
    
}