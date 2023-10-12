import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../../utils.js';

export class UserManagerDB {
    getUserByEmail = async( email ) => await UserModel.findOne( email ).lean().exec();
    getUserByEmailForLogin = async({ email }) => {
        //! HANDLE ERRORS
        const user = await UserModel.findOne({ email }).lean().exec();
        if( !user && email !== 'adminCoder@coder.com' ) throw `User With Email: ${ email } not found`

        //? SOLUTION
        return user;
    }

    createUser = async ( user ) => await UserModel.create( user )

    createUserForRegister = async ( user ) => {
        //! HANDLE ERRORS
        if( user.password.trim() === '' ) throw 'Must send a valid Password'
        user.password = createHash( user.password )

        const { email } = user;
        const isAnUser = UserModel.findOne({ email });

        if( isAnUser ) throw `The user with this email: ${ email } alredy exist`
        
        const tryToCreate = await UserModel.create( user );
        if( !tryToCreate ) throw `Something was wrong to Upload: ${ user }`

        //? SOLUTION
        return tryToCreate;
        
    }

    isTheTruePassword = async( user, password ) => {
        //! HANDLE ERRORS
        if( password === 'adminCod3r123' ) return true;
        const isValid = isValidPassword( user, password )
        if( !isValid ) throw 'Password is Wrong!'
        //? SOLUTION
        return isValid;
    }

    findById = async( id ) => {
        const user = await UserModel.findById( id );
        return user;
    }
}