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
        Swal.fire({ title: 'Empty Cart?', showCancelButton: true })
            .then( async(result) => {
                if (result.isConfirmed) {
                    await fetch(`/api/carts/${ cid }`,{
                        method: 'delete'
                    })
                    location.reload()
                }
            })
    } catch ( err ) {
        alert(`Ocurrio un error: ${err.error}`)
    }
}

const purchase = async( cid ) => {
    try {
        const response = await fetch(`/api/carts/${ cid }/purchase`)
        const { status, payload} = await response.json()
        const { withoutStock, ticket } = payload;

        console.log( !ticket )
        
        if( withoutStock?.length > 0 && !ticket ) {
            return Swal.fire('Without Stock at the moment!')
        }
        if( ticket ) {
            Swal.fire(`Purchase made successfully!`)
                .then( async(result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    }
                })
        }

    } catch( err ){
        console.log( err )
    }
}
 