const socket = io()
let createForm = document.getElementById('createForm')
let createBtn = document.getElementById('createBtn')

createBtn.addEventListener('click', (evt) => {
    const formData = new FormData( createForm )
    fetch('/api/products', {
        method: 'post',
        body: formData,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
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
        document.getElementById('thumbnail').value = ''
    })
    .catch(err => alert(`Ocurrió un error: \n${err}`))
})

createForm.addEventListener('submit', evt => {
    evt.preventDefault()
    const formData = new FormData( createForm )
    const data = new URLSearchParams( formData )
    console.log(evt.target.title.value)
})

const deleteProduct = ( id ) => {
    console.log( id )
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
            <td><button onclick="deleteProduct('${product._id}')" class="btn btn-outline-danger">Remove</button></td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
            <td>${product.status}</td>
            <td>${product._id}</td>
        `
        tBody.appendChild(tr) 
    }

})