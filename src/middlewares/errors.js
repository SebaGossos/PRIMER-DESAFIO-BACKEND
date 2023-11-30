import { EErros } from "../service/errors/index.js"



export default ( error, req, res, next ) => {

    console.log( error.cause )

    switch( error.code ) {

        case EErros.INVALID_TYPES_ERROR:
            res.status(400).json({ status: 'error', error: error.name })
            break
        default:
            res.send({ status: 'errror', error: 'Unhandled Error' })
            break;

    }

}