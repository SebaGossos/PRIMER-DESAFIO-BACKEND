
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


const premium = async() => {
    const bePremium = await fetch('/api/auth/premium')
    const data = await bePremium.json()
    console.log( data )
    location.reload()
}

const standar = async() => {
    const beStandar = await fetch('/api/auth/standar')
    const data = await beStandar.json()
    console.log( data )
    location.reload()
}