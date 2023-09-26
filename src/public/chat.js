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
    
    let chatBox = document.getElementById('chatbox')
    chatBox.addEventListener('keyup', e => {
        if( e.key === 'Enter' ) {
            if (chatBox.value.trim().length > 0 ) {
                socket.emit('message', {
                    user,
                    message: chatBox.value
                })
            }
        }
    })
})
const logElement = document.getElementById('log')
socket.on('log', log => {
    logElement.innerText = ''
    for( let i = 0; i < log.length; i++ ){
        const div = document.createElement('div');
        div.innerHTML = `${log[i].user}: ${log[i].message}</br>`
        
        logElement.appendChild(div)
    }
})




