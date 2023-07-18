import "dotenv/config";
import express from "express";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import { engine } from 'express-handlebars'
import cors from 'cors'
import moongose from 'mongoose'
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import * as path from "path";
import { __dirname } from "./path.js";
import compression from 'express-compression'
import routerIndex from "./routes/index.routes.js";
import initializatePassport from "./config/passport.js";
import { createMessage, readMessages } from "./services/chatService.js";
import errorHandler from "./config/middlewars/errorHandler.js";
import { addLogger } from "./utils/logger.js";

// Cors
const whitelist = ['http://localhost:3000'] // Rutas validas

// Esta parte esta comentada porque me da error
const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by Cors'))
      }
    }
}

// Iniciar server
const app = express();
const PORT = process.env.PORT || 5000

// Middlewars
// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions))

// cookies
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.URLMONGODB,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 1000000
  }),
  secret: process.env.SESSION_COOKIE,
  resave: true,
  saveUninitialized: true
}))

// passport
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

// Compression
app.use(compression({
  brotli: { enabled: true, zlib: {} }
}))

// handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'))

// Moongose
const connectionMoongose = async () => {
  await moongose.connect(process.env.URLMONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error))
}

connectionMoongose()

// Logger
app.use(addLogger)

// Port
app.set("port", process.env.PORT || 8080);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});


// ServerIO
export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Client connected");

  socket.on("message", async (info) => {        // Le envio al servidor la funcion y la muestro en HBS o en frontend
    await createMessage([info]);
    const message = await readMessages();
    console.log(message);
    socket.emit("allMessages", message);
  });
});

// Configuración SWAGGER
const swaggerOptions = {
  definition:{
      openapi: '3.0.1',
      info:
      {
          title: "Doc Backend Santiago Cravero",
          description: "API para E-commerce realizado en curso React en Coderhouse."
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Routes
app.use("/", express.static(__dirname + "/public"));

app.use("/", routerIndex)

// Error Handler
app.use(errorHandler)