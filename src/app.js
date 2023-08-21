import express from 'express'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/cart.router.js'

const app = express()

app.use( express.json() )
app.use('/app' ,express.static('./public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

let a = 1;
const b = a++
const c = ++a
console.log( a, b, c )


app.listen( 8080, () => console.log('SERVER UP!!')) 