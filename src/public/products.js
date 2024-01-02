
const callApiAddProd = async( cid , pid ) => {

    try{
        const result = await fetch( `/api/carts/${cid}/product/${pid}`, {
            method: 'post'
        })

        const data = await result.json()
        data.status === 'error' ? Swal.fire(data.message) : Swal.fire(`Added Successfully!`);
        
    } catch ( err ) {

        alert(`Ocurrio un error: ${err.error}`)
    }
}


const changeRoleUser = async( uid ) => {
    const bePremium = await fetch(`/api/auth/premium/${uid}`)
    const data = await bePremium.json()
    console.log( data )
    location.reload()
}

