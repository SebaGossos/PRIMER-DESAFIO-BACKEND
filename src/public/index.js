const socket = io()
let createForm = document.getElementById('createForm')
let createBtn = document.getElementById('createBtn')
let inputCode = document.getElementById('codeUpdate')


function cleanInputs (data) {
    switch(data) {
        case 'add':
            document.getElementById('title').value = ''
            document.getElementById('description').value = ''
            document.getElementById('price').value = ''
            document.getElementById('code').value = ''
            document.getElementById('stock').value = ''
            document.getElementById('thumbnail').value = ''
            break;
        case 'update':
            document.getElementById('titleUpdate').value = ''
            document.getElementById('descriptionUpdate').value = ''
            document.getElementById('priceUpdate').value = ''
            // document.getElementById('codeUpdate').value = ''
            document.getElementById('stockUpdate').value = ''
            document.getElementById('thumbnailUpdate').value = ''
            break;
            
        default:
            cleanInputs('add');
            cleanInputs('update');
            break;
    }
}

function autoCompleteInput ( data = false ) {
    if ( data ) {
        document.getElementById('titleUpdate').value = data.title
        document.getElementById('descriptionUpdate').value = data.description
        document.getElementById('priceUpdate').value = data.price
        document.getElementById('stockUpdate').value = data.stock
        document.getElementById('thumbnailUpdate').value = data.thumbnail
    }else{
        cleanInputs('update')
    }
}

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
        cleanInputs('add')
    })
    .catch(err => alert(`Ocurrió un error: \n${err}`))
})


let timerId;
inputCode.addEventListener('input', (evt) => {

  clearTimeout(timerId);


  timerId = setTimeout(function() {
      fetch(`/api/products/query/${ inputCode.value }`)
      .then( result => result.json() )
      .then( result  => {
          result.payload ?
          document.getElementById('isCode').innerHTML = ` YES
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          `: document.getElementById('isCode').innerHTML = ` NO
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark-x-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6.854 5.146a.5.5 0 1 0-.708.708L7.293 7 6.146 8.146a.5.5 0 1 0 .708.708L8 7.707l1.146 1.147a.5.5 0 1 0 .708-.708L8.707 7l1.147-1.146a.5.5 0 0 0-.708-.708L8 6.293 6.854 5.146z"/>
          </svg>
          `;
          autoCompleteInput(result.payload);
    })
    .catch(err => console.log( err ))

  }, 1000);
});


// createForm.addEventListener('submit', evt => {
//     evt.preventDefault()
//     const formData = new FormData( createForm )
//     const data = new URLSearchParams( formData )
//     console.log(evt.target.title.value)
// })

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