import "dotenv/config";
import express from 'express'
import { Server } from "socket.io";
import { getManagerMessage } from "./dao/daoManager.js";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import * as path from "path";
import routerSocket from "./routes/socket.routes.js";

const app = express();

// Middlewars
// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views")); // __dirname + views

// Port
app.set("port", process.env.PORT || 8080);

const server = app.listen(
  app.get("port", () => console.log(`Server on port ${app.get("port")}`))
);

// ServerIO
const io = new Server(server);

const data = await getManagerMessage();
const managerMessage = new data.ManagerMessageMongoDB;

io.on("connection", async (socket) => {
  console.log("Client connected");

  socket.on("messageConnection", async (info) => {
    await managerMessage.addElements([info]);
    const message = await managerMessage.getElements();
    console.log(message);
    socket.emit("allMessages", message);
  });
});

// Routes
app.use("/", express.static(__dirname + "/public"));

app.use("/chat", routerSocket);