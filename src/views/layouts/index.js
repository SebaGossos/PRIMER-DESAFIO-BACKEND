const socketClient = io()
// let chatBox = document.getElementById('chatBox')
let addProduct = document.getElementById('addProduct')

addProduct.addEventListener('submit', (evt) => {
    // evt.preventDefault()
    console.log(3344)
    console.log( evt.target )
})

// chatBox.addEventListener('keyup', (evt) => {
//     console.log(3)
//     socketClient.emit( 'messages', evt.key )
// })

// socketClient.on('history', data => {
//     let history = document.getElementById('history');
//     let messages = ''
//     data.forEach( ( { userId, message } ) => {
//         messages += `${ userId }: ${ message } <br>`
//     });
//     history.innerHTML = messages;
//     chatBox.value = ''
// })