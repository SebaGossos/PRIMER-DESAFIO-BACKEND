const callApiDeleteProd = async( cid , pid ) => {

    try{
        await fetch( `/api/carts/${cid}/product/${pid}`, {
            method: "delete"
        })
        alert(`product ${pid} delete successfully!`)
        location.reload()

    } catch ( err ) {
        alert(`Ocurrio un error: ${err.error}`)
    }
}

const deleteProducts = async( cid ) => {
    try{
        await fetch(`/api/carts/${ cid }`,{
            method: 'delete'
        })
        alert(`Empty Cart`)
        location.reload()
    } catch ( err ) {
        alert(`Ocurrio un error: ${err.error}`)
    }
}
