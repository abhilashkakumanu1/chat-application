import path from "path";
import http from "http";

import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

// TODO: Figure out a way to have these common for FE & BE
const CONFIG = {
  FROM_FRONTEND: "message from frontend",
  FROM_BACKEND: "message from backend",
};

const app = express();

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

  socket.on(CONFIG.FROM_FRONTEND, (msg) => {
    console.log(`message from backend: ${msg}`);
    io.emit(CONFIG.FROM_BACKEND, msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// ---------------------------------

app.get("/health-check", (_, res) => {
  res.send("Hello world!!!!");
});

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
