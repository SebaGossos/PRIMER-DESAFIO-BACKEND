import passport from "passport";
import local from "passport-local";
import { UserManagerDB } from "../dao/db/user_managerDB.js";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy
const userManagerDB = new UserManagerDB();

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done ) => {
        const { first_name, last_name, email, age } = req.body;
        try{

            const user = await userManagerDB.getUserByEmail({ email: username })
            if ( user ) {
                return done( null, false )
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash( password )
            }
            const result = await userManagerDB.createUser(newUser)

            return done( null, result )

        } catch ( err ) {
            return done( err )
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        try {
            const isAdmin = username === 'adminCoder@coder.com' && password === 'adminCod3r123'
                ? true 
                : false;

            // if ( isAdmin ) return done( null, true )
            if ( isAdmin ) {
                const user = {email: username, role: 'admin', _id: '123'}

                return done( null, user )
            }
            const user = await userManagerDB.getUserByEmail({ email: username })
            if( !user ) return done( null, false );
            if( !isValidPassword( user,  password ) ) return done( null, false );
            user.role = 'user';
            return done( null, user )
        } catch( err ) {
            done( err )
        }
    }))

    passport.serializeUser((user, done) => {
        done( null, user._id )
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userManagerDB.findById(id);
        done(null, user)
    })
    


}

export default initializePassport;