import path from "path";
import http from "http";

import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

// TODO: Figure out a way to have these common for FE & BE
const CONFIG = {
  MESSAGE_FROM_FRONTEND: "message from frontend",
  MESSAGE_FROM_BACKEND: "message from backend",
  ADD_USER: "add new user",
  USER_ADDED: "new user successfully added",
};

const app = express();

// LOCAL DB
interface IDB {
  [username: string]: boolean;
}

const DB: IDB = {};

// Allow CORS
app.use(
  cors({
    origin: "*",
  })
);

const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.use(express.static(path.resolve(__dirname, "./public/")));

// ---------------------------------

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on(CONFIG.MESSAGE_FROM_FRONTEND, (msg) => {
    console.log(`message from backend: ${msg}`);
    io.emit(CONFIG.MESSAGE_FROM_BACKEND, msg);
  });

  socket.on(CONFIG.ADD_USER, (username) => {
    console.log(`New user: ${username}`);
    DB[username] = true;
    socket.broadcast.emit(CONFIG.USER_ADDED, username);
  });
});

// ---------------------------------

app.get("/health-check", (_, res) => {
  res.send("Hello world!!!!");
});

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
