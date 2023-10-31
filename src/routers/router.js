import { Router } from "express";

export default class MyRouter {
    constructor(){
        this.router = Router()
        this.init()
    }

    init() {}

    getRouter() {
        return this.router;
    }

    get( path, ...callbacks ) {
        this.router.get( path, this.applyCallbacks( callbacks ) )
    }

    post( path, ...callbacks ) {
        this.router.post( path, this.applyCallbacks( callbacks ) )
    }

    put( path, ...callbacks ) {
        this.router.put( path, this.applyCallbacks( callbacks ) )
    }
    
    delete( path, ...callbacks ) {
        this.router.delete( path, this.applyCallbacks( callbacks ) )
    }

    applyCallbacks( callbacks ) {
        return callbacks.map( callback => async(...params) => {
            try{
                await callback.apply( this, params );
            } catch( err ) {
                params[1].status(500).send( err );
            }
        })
    }

    // handlePolicies = policies => (req, res, next) => {
    //     if( policies.includes('PUBLIC') ) return next()
    //     else {
    //         const token = 
    //     }
    // }    
    
}