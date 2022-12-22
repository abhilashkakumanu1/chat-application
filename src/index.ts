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
  USER_TYPING_FROM_FRONTEND: "user started typing",
  USERS_TYPING_FROM_BACKEND: "users typing",
};

const app = express();

// LOCAL DB
type Users = {
  [username: string]: boolean;
};

interface IDB {
  users: Users;
  currentlyTypingUsers: Users;
}

class InMemory_DB implements IDB {
  private _users: Users;
  private _currentlyTypingUsers: Users;

  constructor() {
    this._users = {};
    this._currentlyTypingUsers = {};
  }

  // Getters
  public get users(): Users {
    return this._users;
  }

  public get currentlyTypingUsers(): Users {
    return this._currentlyTypingUsers;
  }

  // Setters
  public addUsers(username: string) {
    this._users[username.trim()] = true;
  }

  public addCurrentlyTypingUser(username: string) {
    this._currentlyTypingUsers[username.trim()] = true;
  }

  public removeCurrentlyTypingUser(username: string) {
    delete this._currentlyTypingUsers[username.trim()];
  }

  // Utility Funcs
  public getUsersTypingMsg(): string {
    const usernames = Object.keys(this._currentlyTypingUsers);
    if (usernames.length === 1) {
      return `${usernames[0]} is typing....`;
    } else if (usernames.length > 1) {
      return usernames.join(", ") + " are typing....";
    } else {
      return "";
    }
  }
}

const db = new InMemory_DB();

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

  socket.on(CONFIG.MESSAGE_FROM_FRONTEND, (msg: string) => {
    console.log(`message from backend: ${msg}`);
    io.emit(CONFIG.MESSAGE_FROM_BACKEND, msg);
  });

  socket.on(CONFIG.ADD_USER, (username: string) => {
    console.log(`New user: ${username}`);
    db.users[username] = true;
    socket.broadcast.emit(CONFIG.USER_ADDED, username);
  });

  socket.on(CONFIG.USER_TYPING_FROM_FRONTEND, (username: string) => {
    db.addCurrentlyTypingUser(username);

    const usersTypingMsg = db.getUsersTypingMsg();
    socket.emit(CONFIG.USERS_TYPING_FROM_BACKEND, usersTypingMsg);
  });
});

// ---------------------------------

app.get("/health-check", (_, res) => {
  res.send("Hello world!!!!");
});

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
