import cartsRouter from './cart.router.js';
import productsRouter from './products.router.js';
import viewRouter from './view.router.js';
import chatRouter from './chat.router.js'
import authRouter from './auth.router.js'

const customAuthRouter = new authRouter();
const customProductRouter = new productsRouter();
const customCartRouter = new cartsRouter();
const customChatRouter = new chatRouter();
const customViewRouter = new viewRouter();

export {
    customAuthRouter,
    customProductRouter,
    customCartRouter,
    customChatRouter,
    customViewRouter
}