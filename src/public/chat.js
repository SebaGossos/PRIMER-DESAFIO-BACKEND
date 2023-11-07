let socket = io()
Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Set a username for the chat',
    inputValidator: value => {
        return !value.trim() && 'Please, write a valid username'
    },
    allowOutsideClick: false
}).then( result => {
    let user = result.value
    document.getElementById('username').innerHTML = user;

    fetch('/api/chat')
        .then(result => result.json())
        .then( result => {
            socket.emit('logDB', result.payload)
        })
    
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
                    console.log( result.payload )
                    socket.emit('message', result.payload)
                    chatBox.value = ''
                })

            }
        }
    })
})
const logElement = document.getElementById('log')
socket.on('log', log => {
    console.log( log )
    logElement.innerText = ''
    let message = '';
    for( let i = 0; i < log.length; i++ ){
        message += `<p><i>${log[i].first_name}</i>: ${log[i].message}</p>`
    }
    logElement.innerHTML = message;
})




