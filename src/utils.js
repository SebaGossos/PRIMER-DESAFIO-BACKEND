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
    if( !token ) return res.status(401).send({ error: 'Not Authorized' })
    jwt.verify( token, 'secret', ( err, credentials) => {
        if( err ) return res.status(403).send({ error: 'Not Authorized' })
        req.user = credentials.user;
        next()
    })
    
}

export default __dirname;