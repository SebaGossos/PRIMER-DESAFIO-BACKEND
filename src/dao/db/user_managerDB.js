import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../../utils.js';

export class UserManagerDB {
    getUserByEmail = async( email ) => {
        //! HANDLE ERRORS
        const user = await UserModel.findOne({ email }).lean().exec();
        if( !user ) throw `User With Email: ${ email } not found`

        //? SOLUTION
        return user;
    }

    createUser = async ( user ) => {
        //! HANDLE ERRORS
        if( user.password.trim() === '' ) throw 'Must send a valid Password'
        user.password = createHash( user.password )
        const tryToCreate = await UserModel.create( user );
        if( !tryToCreate ) throw `Something was wrong to Upload: ${ user }`

        //? SOLUTION
        return tryToCreate;
        
    }

    isTheTruePassword = async( user, password ) => {
        //! HANDLE ERRORS
        const isValid = isValidPassword( user, password )
        if( !isValid ) throw 'Password is Wrong!'
        //? SOLUTION
        return isValid;
    }
}