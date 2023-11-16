let socket = io()
// Swal.fire({
//     title: 'Authentication',
//     input: 'text',
//     text: 'Set a username for the chat',
//     inputValidator: value => {
//         return !value.trim() && 'Please, write a valid username'
//     },
//     allowOutsideClick: false
// }).then( result => {
//     let user = result.value
// })

let counter = 0;
let user;

const userElement = document.getElementById('username')
const logElement = document.getElementById('log')

while( counter < 1 ){
    fetch('/api/chat')
        .then(result => result.json())
        .then( result => {
            user = result.payload.currentUser
            userElement.innerText = `${ user }`
            
            let logHTML = '';
            log = result.payload.log.reverse();

            
            for ( let i=0; i < log.length; i++ ){
                const { user:userLog, message } = log[i];
                logHTML += `<p class="m-0"><i>${userLog}</i>: ${message}</p>`                
            }
    
            logElement.innerHTML = logHTML;
            
            socket.emit('logDB', log)
        })
    
    ++counter
}


let chatBox = document.getElementById('chatbox')
chatBox.addEventListener('keyup', e => {
    if( e.key === 'Enter' ) {
        if (chatBox.value.trim().length > 0 ) {
            fetch('/api/chat',{
                method: 'post',
                body: JSON.stringify({
                    user,
                    message: chatBox.value
                }),
                headers: {'Content-Type': 'application/json'}
            })
            .then(result => result.json())
            .then( result => {
                socket.emit('message', result.payload)
                chatBox.value = ''
            })

        }
    }
})


socket.on('log', log => {
    logElement.innerText = ''
    let message = '';
    for( let i = 0; i < log.length; i++ ){
        message += `<p class="m-0"><i>${log[i].user}</i>: ${log[i].message}</p>`
    }
    logElement.innerHTML = message;
})




