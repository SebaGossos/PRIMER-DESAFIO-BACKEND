import express from 'express'
import handlebars from 'express-handlebars'
import cartsRouter from './routers/cart.router.js'
import productsRouter from './routers/products.router.js'
import viewRouter from './routers/view.router.js'
import { Server } from 'socket.io'

const app = express()

app.use( express.json() )
app.engine( 'handlebars', handlebars.engine() )
app.set( 'views', './src/views' )
app.set( 'view engine', 'handlebars' )


// app.use('/app' ,express.static('./public'))
app.use( express.static('./src/public') )


app.use( '/products/', viewRouter )
app.use( '/api/products', productsRouter )
app.use( '/api/carts', cartsRouter ) 
                
                
const httpServer = app.listen( 8080, () => console.log('SERVER UP!!')) 
const io = new Server( httpServer )


io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${ socket.id}`) 
    socket.on('productList', data => {
        io.emit( 'updatedProducts', data )
    })
}) 
