import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { UserManagerDB } from "../dao/db/user_managerDB.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'passport-jwt'

import UserModel from "../dao/models/user.model.js";

const userManagerDB = new UserManagerDB();

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const cookieExtractor = req => (req && req.signedCookies) ? req.signedCookies['jwt-coder'] : null;


const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([ cookieExtractor ]),
        secretOrKey: 'secret'
    }, async(jwt_payload, done) => {
        try {
            if (jwt_payload.user.role === 'admin') return done(null, jwt_payload)
            else return done(null, 'error')
        } catch(error) {
            return done(error)
        }
    }))

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done ) => {
        const { first_name, last_name, email, age } = req.body;
        try{

            const user = await userManagerDB.getUserByEmail({ email: username })
            if ( user ) {
                return done( null, false, {info: 'error del regis'})
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
            const user = await userManagerDB.getUserByEmail({ email: username })
            if( !user ) return done( null, false );
            if( !isValidPassword( user, password ) ) return done( null, false );
            user.role = 'user';
            return done( null, user )

        } catch( err ) {
            done( err )
        }
    }))


    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.5c7fc3c28a580495',
        clientSecret: '0f3e93baae1f5beffd9ca83307d5064a26e0a20a',
        callbackURL: 'http://localhost:8080/api/auth/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log( profile )
        try{
            const user = await userManagerDB.getUserByEmail({ email: profile._json.email})
            if ( user ) return done( null, user )
            const newUser = await userManagerDB.createUser({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: '',
                age: '',
                source: profile.provider
            })
            return done( null, newUser )

        } catch(err) {
            return done('Error to login with github')
        }
    }))
    
    

    // passport.serializeUser((user, done) => {
    //     done( null, user._id )
    // })

    // passport.deserializeUser(async (id, done) => {
    //     const user = await userManagerDB.findById(id);
    //     done(null, user)
    // })
    


}

export default initializePassport;