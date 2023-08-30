import express from 'express'
import handlebars from 'express-handlebars'
import cartsRouter from './routers/cart.router.js'
import productsRouter from './routers/products.router.js'
import homeRouter from './routers/home.router.js'
import realTimeProductsRouter from './routers/realTimeProducts.router.js'
import { Server } from 'socket.io'

const app = express()

app.use( express.json() )
app.engine( 'handlebars', handlebars.engine() )
app.set( 'views', './src/views' )
app.set( 'view engine', 'handlebars' )


// app.use('/app' ,express.static('./public'))
app.use( express.static('./src/views/layouts') )
app.use( '/', homeRouter ) 


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/realtimeproducts', realTimeProductsRouter)
                
                
const httpServer = app.listen( 8080, () => console.log('SERVER UP!!')) 
const socketServer = new Server( httpServer )

let log = []

socketServer.on('connection', (socketClient) => {
    console.log(`Nuevo cliente conectado ${ socketClient.id}`) 
    socketClient.emit( 'history', log )
    socketClient.on('message', data => { 
        log.push({ userId: socketClient.id, message: data })
        socketServer.emit( 'history', log )
    })
}) 
