export default class UserRepository {
    constructor( dao ) {
        this.dao = dao;
    }

    getAll = async() => await this.dao.getAll()
    getByEmail = async( email ) => await this.dao.getByEmail( email )
    getByEmailForLogin = async( email ) => await this.dao.getByEmail( email )
    create = async( user ) => await this.dao.create( user );
    createForRegister = async( user ) => await this.dao.createForRegister( user )
    findById = async( id ) => await this.dao.findById( id )
    update = async( id, data ) => await this.dao.update( id, data )
    deleteUser = async( email ) => await this.dao.deleteUser( email )
    
}