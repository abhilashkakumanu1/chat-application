import path from "path";
import http from "http";

import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

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
});

// ---------------------------------

app.get("/health-check", (_, res) => {
  res.send("Hello world!!!!");
});

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
