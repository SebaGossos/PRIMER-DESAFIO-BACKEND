import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { cartsRouter, productsRouter, viewRouter, chatRouter, authRouter } from './routers/index.js';
import { Server } from 'socket.io';


// import { fork } from 'child_process'

//! CUSTOMS ROUTERS
const customAuthRouter = new authRouter();
const customProductRouter = new productsRouter();
const customCartRouter = new cartsRouter();
const customChatRouter = new chatRouter();
const customViewRouter = new viewRouter();


import passport from 'passport';
import initializePassport from './config/passport.config.js';

export const PORT = 8080;

const app = express();


// const a = 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/?retryWrites=true&w=majority'
// const b = 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/'



app.use( express.json() )
app.use( express.urlencoded({ extended: true }) ) 
app.use( cookieParser('secret') )
// app.use( session({
//     // store: MongoStore.create({
//     //     mongoUrl: 'mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/?retryWrites=true&w=majority',
//     //     dbName: 'sessions',
//     // ttl: 86400 ----> 1 día
//     // }),
//     secret: '1234',
//     resave: true,
//     saveUninitialized: true
// }))

initializePassport()
app.use( passport.initialize() )
// app.use( passport.session() )


app.engine( 'handlebars', handlebars.engine() )
app.set( 'views', './src/views' )
app.set( 'view engine', 'handlebars' )

app.use( express.static('./src/public') )

app.use( '/api/auth', customAuthRouter.getRouter() ) 
app.use( '/api/products', customProductRouter.getRouter() )
app.use( '/api/carts', customCartRouter.getRouter() ) 
app.use( '/api/chat', customChatRouter.getRouter() ) 
app.use( '/', customViewRouter.getRouter() )

app.get( '*', async(req, res) => res.status(404).render('errors/errorPlatform',{ error: 'Cannot get the specified endpoint' } ) )

try{
    await mongoose.connect('mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/',{
        dbName: 'ecommerce'
    })
}catch(err) {
    console.log( 'Error to connect DB' )
}



const httpServer = app.listen( PORT, () => console.log(`SERVER UP!! http://localhost:${PORT}`) ) 



let log = []

const io = new Server( httpServer );
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${ socket.id }`)

    //! realTimeProducts
    socket.on('productList', data => {
        io.emit( 'updatedProducts', data )
    })

    //! chat
    socket.on('logDB', data => {
        log = data;
        io.emit('log', log.reverse())
    })

    socket.on('message', data => {
        log.push( data );
        io.emit('log', log.reverse())
    })
})