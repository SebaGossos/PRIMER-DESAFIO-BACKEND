import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { cartsRouter, productsRouter, viewRouter, chatRouter, sessionRouter } from './routers/index.js';
import { Server } from 'socket.io';
import MongoStore from 'connect-mongo';
import session from 'express-session';

import passport from 'passport';
import initializePassport from './config/passport.config.js';

export const PORT = 8080;

const app = express();


// const a = 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/?retryWrites=true&w=majority'
// const b = 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/'



app.use( express.json() )
app.use( urlencoded({ extended: true }) ) 
app.use( session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/?retryWrites=true&w=majority',
        dbName: 'sessions',
        // ttl: 86400 ----> 1 día
    }),
    secret: '1234',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use( passport.initialize() )
app.use( passport.session() )


app.engine( 'handlebars', handlebars.engine() )
app.set( 'views', './src/views' )
app.set( 'view engine', 'handlebars' )

// app.use('/app' ,express.static('./public'))
app.use( express.static('./src/public') )

app.use( '/api/products', productsRouter )
app.use( '/api/carts', cartsRouter ) 
app.use( '/api/chat', chatRouter ) 
app.use( '/api/sessions', sessionRouter )
app.use( '/', viewRouter )

try{
    await mongoose.connect('mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/',{
        dbName: 'ecommerce'
    })
    
}catch(err) {
    console.log( 'Error to connect DB' )
}

let log = []


const httpServer = app.listen( PORT, () => console.log('SERVER UP!!')) 


const io = new Server( httpServer );
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${ socket.id }`) 
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

