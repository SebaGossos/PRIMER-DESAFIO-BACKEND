const callApiDeleteProd = async( cid , pid ) => {

    try{
        await fetch( `/api/carts/${cid}/product/${pid}`, {
            method: "delete"
        })
        Swal.fire(`product ${pid} delete successfully!`)
            .then( async(result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            })
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
        let { withoutStock, ticket } = payload;
        console.log( ticket )
        
        if( withoutStock?.length > 0 && !ticket ) {
            return Swal.fire('Without Stock at the moment!')
        }
        if( ticket ) {
            // TODO: FOR THE TICKET EMAIL
            let wantTheEmail = false;

            const next = await Swal.fire(`Purchase made successfully!`)


            if( next ) {
                await Swal.fire({
                        title: '¿Do you want us to send you an email with the ticket?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes'
                    }).then( async(result) => {
                    if (result.isConfirmed) {
                        wantTheEmail = true

                    } else {
                        const next = await Swal.fire( `The email will not be sent` )
                        if( next ) location.reload()
                    }
                })
            }
            
            if( wantTheEmail ) {
                const { value: email } = await Swal.fire({
                    title: "Enter your email",
                    input: "email",
                    inputLabel: "Your email address",
                    inputPlaceholder: "Enter your email address",
                    showCancelButton: true,
                    confirmButtonText: 'Send',
                    allowOutsideClick: false,
                    preConfirm: (email) => {
                        if( !email ) {
                            Swal.showValidationMessage('Please enter a valid email')
                        }
                    }
                });
                if (email) {
                    console.log(':)')
                    let ticketUpdated = { ...ticket, emailToSend: email }
                    console.log( ticketUpdated )
       
                    const response = await fetch('/api/carts/getbill',{
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({ ticket: ticketUpdated })
                    })
                    const data = await response.json()
                    console.log( data )
                    // Swal.fire(`Sent ticket to: ${email}`);
                }
            }
            // console.log( email )

            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // Swal.fire(`Purchase made successfully!`)
            //     .then( async(result) => {
            //         if (result.isConfirmed) {
            //             location.reload()
            //         }
            //     })
        }

    } catch( err ){
        console.log( err )
    }
}
 