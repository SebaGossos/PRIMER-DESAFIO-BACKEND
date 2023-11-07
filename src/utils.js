import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );


// helpers functions
export const createHash = password => bcrypt.hashSync( password, bcrypt.genSaltSync(10) );
export const isValidPassword = ( user, password ) => bcrypt.compareSync( password, user?.password )

//? ---- JWT ---- 
export const generateToken = ( user ) => jwt.sign( { user }, 'secret', { expiresIn: '24h'})
export const authToken = ( req, res, next ) => {
    // const token = req.headers.auth;

    const token = req.signedCookies['jwt-coder']
    if( !token ) return res.status(401).clearCookie('jwt-coder').render('errors/errorAuth', { error: 'Not authorized' })
    jwt.verify( token, 'secret', ( err, credentials) => {
        if( err ) return res.status(403).clearCookie('jwt-coder').render('errors/errorAuth', { error: 'Not authorized' })
        req.user = credentials.user;
        next()
    })
    
}
export const passportCall = strategy => {
    return async ( req, res, next ) => {
        passport.authenticate(strategy, function(err, user, info) {
            if( err ) return next( err );
            if( !user ) return res.status(401).render('errors/errorAuth', {error: 'Need auth!'})
            req.user = user;
            next()
        })(req, res, next)
    }
}


export default __dirname;