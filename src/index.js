import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import * as path from "path";
import { __dirname } from "./path.js";
import { getManagerMessage } from "./dao/daoManager.js";
import routerIndex from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

// Middlewars
// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views")); // __dirname + views
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

// Port
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), () => {
  console.log(`Server running on Port: ${app.get("port")}`);
});

// ServerIO
const io = new Server(server);

const data = await getManagerMessage();
const managerMessage = new data.ManagerMessageMongoDB();

io.on("connection", async (socket) => {
  console.log("Client connected");

  socket.on("message", async (info) => {            // Le envio al servidor la funcion y la muestro en HBS
    await managerMessage.addElements([info]);
    const message = await managerMessage.getElements();
    console.log(message);
    socket.emit("allMessages", message);
  });
});

// Routes
app.use("/", express.static(__dirname + "/public"));

app.use("/", routerIndex)