// /api/auth/changePassword
const buttonChange = document.getElementById('changePassword')
const inputPassword = document.getElementById('passwordInput')

const namePath = window.location.pathname.split('/')
const token = namePath[namePath.length - 1] 

buttonChange.addEventListener('click', e => {
    const password = inputPassword.value.trim()
    if( password === '' ){
        Swal.fire(`You have to add a correct password!`)
    } else {
        fetch('/api/auth/changePassword',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                token
            })
        })
        .then( res => res.json() )
        .then( async res => {

            if( res.status === 'error' ) {
                await Swal.fire(res.error)  
            } else {
                await Swal.fire(res.message)
                window.location.href = 'http://localhost:8080/'
            }
        })
        .catch( error => console.log( error ) )
    }
})