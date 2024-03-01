export const ErrorInfoProd = product => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
        - title: Must be a string. ( ${product.title} - type: ${typeof product.title}  )
        - description: Must be a string. ( ${product.description} - type: ${typeof product.description}  )
        - price: Must be a number. ( ${product.price} - type: ${typeof product.price} )
        - code: Must be a string. ( ${product.code} - type: ${typeof product.code}  )
        - stock: Must be a number. ( ${product.stock} - type: ${typeof product.stock}  )
        - category: Must be a string. ( ${product.category} - type: ${typeof product.category}  )
        - thumbnail: Must be Array with string. ( ${product.thumbnail} - type: ${typeof product.thumbnail}  )
    `
}

export const ErrorInfoGetByCode = code => `WRONG CODE WAS SEND: ${ code } => ${ typeof code } , you must submit a string with the correct code to continue.`

export const ErrorInfoGetById = pid => `WRONG ID WAS SEND: ${ pid } => ${ typeof pid } , Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`;
