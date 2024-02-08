const bePremium = document.getElementById('bePremium');
const uploadPicture = document.getElementById('uploadPicture');

uploadPicture.addEventListener( 'submit', event => {
    event.preventDefault();
})
function pictureUpload( id ) {
    const formData = new FormData(uploadPicture)
    fetch(`/api/users/${id}/profile/picture`, {
        method: 'post',
        body: formData
    })
    .then( res => res.json() )
    .then( async res => {
        if( res.status === 'success' ) {
            await Swal.fire('Updated your picture profile!')
        }
    })
    .then( () => location.reload() )
}

bePremium.addEventListener( 'submit', event => {
    event.preventDefault();
})


const premium = ( id ) => {
    const formData = new FormData(bePremium);
    fetch(`/api/users/${id}/documents`,{
        method: 'post',
        body: formData
    })
    .then( res => res.json() )
    .then( async res => {
        if ( res.status === 'success' ) {
            await Swal.fire(`You are premium`)
            
        }
    })
    .then(() => location.reload() )
}

