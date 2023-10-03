
let cartId;

const callApiAddProd = async( cid , pid ) => {
    try{
        await fetch( `/api/carts/${cid}/product/${pid}`, {
            method: 'post'
        })
        alert('producto agregado al cart!')
    } catch ( err ) {
        alert(`Ocurrio un error: ${err.error}`)
    }
}
const addToCart = ( pid ) => {

    if ( !cartId ) {
        fetch('/api/carts/', {
            method: 'post'
        })
        .then( data => data.json() )
        .then( result => {
            cartId = result.payload._id
            return result.payload._id
        })
        .then( (cid) => callApiAddProd( cid, pid ) )
        .catch( (err) => alert(`Ocurrio un error: ${err.error}`) )
        
    }
    if( cartId ){
        callApiAddProd( cartId, pid )
    }

}