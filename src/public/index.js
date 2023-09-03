const socket = io()
// let chatBox = document.getElementById('chatBox')
let createForm = document.getElementById('createForm')
let createBtn = document.getElementById('createBtn')

createBtn.addEventListener('click', (evt) => {
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: +document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: +document.getElementById('stock').value,
        category: document.getElementById('category').value,
        status: document.getElementById('status').value === 'true',
        thumbnail: document.getElementById('thumbnail').value
    }
    
    fetch('/api/products', {
        method: 'post',
        body: JSON.stringify( body ),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then( result => result.json() )
    .then( result => {
        if ( result.status === 'error' ) throw new Error( result.error )
    })
    .then( () => fetch('/api/products') )
    .then( result => result.json() )
    .then( result => {
        if ( result.status === 'error' ) throw new Error( result.error )
        socket.emit( 'productList', result.payload )
        alert(`Ok. Todo salió bien! :) \nEl producto se ha agregado con éxito!\n \nVista actuallizada`)
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('price').value = ''
        document.getElementById('code').value = ''
        document.getElementById('stock').value = ''
        document.getElementById('category').value = ''
        document.getElementById('status').value = ''
        document.getElementById('thumbnail').value = ''
    })
    .catch(err => alert(`Ocurrió un error: \n${err}`))
})


const deleteProduct = ( id ) => {
    fetch(`/api/products/${ id }`, {
        method: 'delete'
    })
    .then( result => result.json() )
    .then( result => {
        if ( result.status === 'error' ) throw new Error( result.error )
        socket.emit('productList', result.payload)
        alert(`Ok. Todo salió bien! :) \nEl producto se ha eliminado con éxito!`)
    })
}

const tBody = document.getElementById('tBody');
socket.on( 'updatedProducts', data => {
    
    tBody.innerText=''
    for( product of data ){
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td><button onclick="deleteProduct(${product.id})" class="btn btn-outline-danger">Remove</button></td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
            <td>${product.status}</td>
            <td>${product.id}</td>
        `
        tBody.appendChild(tr)
    }

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