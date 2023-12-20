import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import cors from "cors";
import { fork } from "child_process";

import { Server } from "socket.io";
import errorHandler from "./middlewares/errors.js";
import {
  customAuthRouter,
  customProductRouter,
  customCartRouter,
  customChatRouter,
  customViewRouter,
} from "./routers/index.js";
import config from "./config/config.js";

import passport from "passport";
import initializePassport from "./config/passport.config.js";
import logger from "./utilis/logger.js";

// import { EErrosProducts } from './service/errors/index.js';

export const PORT = config.port;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookie.keyCookie));

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

initializePassport();
app.use(passport.initialize());
// app.use( passport.session() )

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.static("./src/public"));

app.use("/api/auth", customAuthRouter.getRouter());
app.use("/api/products", customProductRouter.getRouter());
app.use("/api/carts", customCartRouter.getRouter());
app.use("/api/chat", customChatRouter.getRouter());
app.use("/", customViewRouter.getRouter());
app.use("/loggerTest", (req, res, next) => {
  logger.debug("Logger debug");
  logger.http("Logger http");
  logger.info("Logger info");
  logger.warning("Logger warning");
  logger.error("Logger error");
  logger.fatal("Logger fatal");
  res.send("okk");
});
// app.get('/test-error', (req, res, next) => {
//     const error = new Error('Este es un error de prueba');
//     error.code = EErrosProducts.INVALID_TYPES_ERROR;
//     next(error);
// });

app.use(errorHandler);

app.get("*", async (req, res) =>
  res
    .status(404)
    .render("errors/errorAuth", { error: "Cannot get the specified endpoint" })
);

// try{
//     await mongoose.connect('mongodb+srv://winigossos:coder@cluster0.digmtmx.mongodb.net/',{
//         dbName: 'ecommerce'
//     })
// }catch(err) {
//     console.log( 'Error to connect DB' )
// }

const httpServer = app.listen(PORT, () =>
  logger.debug(`SERVER UP!! http://localhost:${PORT}`)
);

let log = [];

const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  //! realTimeProducts
  socket.on("productList", (data) => {
    io.emit("updatedProducts", data);
  });

  //! chat
  socket.on("logDB", (data) => {
    log = data;
    // io.emit('log', log.reverse())
  });

  socket.on("message", (data) => {
    log.unshift(data);
    io.emit("log", log);
  });
});
