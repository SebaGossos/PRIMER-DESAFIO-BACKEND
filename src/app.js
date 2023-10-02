import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import { cartsRouter, productsRouter, viewRouter, chatRouter } from './routers/index.js'
import { Server } from 'socket.io'


const app = express()

app.use( express.json() )
app.use( urlencoded({ extended: true }) )

app.engine( 'handlebars', handlebars.engine() )
app.set( 'views', './src/views' )
app.set( 'view engine', 'handlebars' )

// app.use('/app' ,express.static('./public'))
app.use( express.static('./src/public') )

app.use( '/api/products', productsRouter )
app.use( '/api/carts', cartsRouter ) 
app.use( '/api/chat', chatRouter ) 
app.use( '/', viewRouter )

try{
    await mongoose.connect('mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/',{
        dbName: 'ecommerce'
    })
    
}catch(err) {
    console.log( err.message )
}

let log = []

export const PORT = 8080;
const httpServer = app.listen( PORT, () => console.log('SERVER UP!!')) 


const io = new Server( httpServer );
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${ socket.id}`) 
    socket.on('productList', data => {
        io.emit( 'updatedProducts', data )
    })
    socket.on('logDB', data => {
        log = data;
        io.emit('log', log.reverse())
    })
    socket.on('message', data => {
        log.push( data );
        io.emit('log', log.reverse())
    })
})

