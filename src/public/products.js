
const callApiAddProd = async( cid , pid ) => {

    try{
        
        await fetch( `/api/carts/${cid}/product/${pid}`, {
            method: 'post'
        })
        Swal.fire(`Added Successfully!`)
        // alert(`producto agregado al cartId: ${cid}`)
    } catch ( err ) {
        alert(`Ocurrio un error: ${err.error}`)
    }
}
