const ErrorInfoProd = product => {
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
export default ErrorInfoProd