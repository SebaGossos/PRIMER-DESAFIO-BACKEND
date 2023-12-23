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
        .then( res => {
            console.log( res )
        })
    }
})