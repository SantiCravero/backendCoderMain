import "dotenv/config";
import express from "express";
import MongoStore from "connect-mongo";
import cors from 'cors'
import moongose from 'mongoose'
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import * as path from "path";
import { __dirname } from "./path.js";
import routerIndex from "./routes/index.routes.js";
import initializatePassport from "./config/passport.js";

// Cors
const whitelist = ['http://localhost:3000'] // Rutas validas

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

// Middlewars
// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

// cookies
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.URLMONGODB,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 90
  }),
  secret: process.env.SESSION_COOKIE,
  resave: true,
  saveUninitialized: true
}))

// passport
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

// Moongose
const connectionMoongose = async () => {
  await moongose.connect(process.env.URLMONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error))
}

connectionMoongose()

// Port
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), () => {
  console.log(`Server running on Port: ${app.get("port")}`);
});

// Routes
app.use("/", express.static(__dirname + "/public"));

app.use("/", routerIndex)