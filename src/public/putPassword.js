// /api/auth/changePassword
const buttonChange = document.getElementById('changePassword')
const inputPassword = document.getElementById('passwordInput')

buttonChange.addEventListener('click', e => {
    const password = inputPassword.value.trim()
    if( password === '' ){
        Swal.fire(`You have to add a correct password!`)
    }
})