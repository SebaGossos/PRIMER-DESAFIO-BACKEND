import { Router } from "express";
import jwt from 'jsonwebtoken';
import config from "../config/config.js";

export default class MyRouter {
    constructor(){
        this.router = Router()
        this.init()
    }

    init() {}

    getRouter() {
        return this.router;
    }

    get( path, policies, ...callbacks ) {
        this.router.get( path, this.#handlePolicies( policies ), this.#applyCallbacks( callbacks ) )
    }

    post( path, policies, ...callbacks ) {
        this.router.post( path, this.#handlePolicies( policies ), this.#applyCallbacks( callbacks ) )
    }

    put( path, policies, ...callbacks ) {
        this.router.put( path, this.#handlePolicies( policies ), this.#applyCallbacks( callbacks ) )
    }
    
    delete( path, policies, ...callbacks ) {
        this.router.delete( path, this.#handlePolicies( policies ), this.#applyCallbacks( callbacks ) )
    }

    #applyCallbacks( callbacks ) {
        return callbacks.map( callback => async(...params) => {
            try{
                await callback.apply( this, params );
            } catch( err ) {
                params[1].status(500).send( err );
            }
        })
    }

    #handlePolicies = (policies=['PUBLIC']) => (req, res, next) => {

        if( policies.includes('PUBLIC') ) return next()
        else {
            const token = req.signedCookies['jwt-coder'];
            if( !token ) {
                return res.status(401).clearCookie('jwt-coder').render('errors/errorAuth', { error: 'Not Authenticated' })
            }
            return jwt.verify(token, config.jwt.keyToken, (err, credentials) => {
                if( err ) return res.status(403).clearCookie('jwt-coder').render('errors/errorAuth', { error: 'Not Authenticated' })
                if( !policies.includes(credentials.user.role.toUpperCase()) ) return res.render('errors/errorPlatform', { error: 'Not Authorized' });
                req.user = credentials.user;
                return next()
            })
        }
    }    


    
}