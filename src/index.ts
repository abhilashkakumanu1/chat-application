import path from "path";
import http from "http";

import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import { CompletionInfoFlags } from "typescript";

// TODO: Figure out a way to have these common for FE & BE
const CONFIG = {
  MESSAGE_FROM_FRONTEND: "message from frontend",
  MESSAGE_FROM_BACKEND: "message from backend",
  ADD_USER: "add new user",
  USER_ADDED: "new user successfully added",
  USER_TYPING_FROM_FRONTEND: "user started typing",
  USER_STOPPED_TYPING_FROM_FRONTEND: "user stopped typing",
  USERS_TYPING_FROM_BACKEND: "users typing",
};

const app = express();

// LOCAL DB
type Users = {
  [username: string]: {
    password: string
  };
};

type CurrentlyTypingUsers = {
  [username: string]: boolean
};

interface IDB {
  users: Users;
  currentlyTypingUsers: CurrentlyTypingUsers;
}

class InMemory_DB implements IDB {
  private _users: Users;
  private _currentlyTypingUsers: CurrentlyTypingUsers;

  constructor() {
    this._users = {};
    this._currentlyTypingUsers = {};
  }

  // Getters
  public get users(): Users {
    return this._users;
  }

  public checkUserExists(username: string): boolean{
    return !!this._users.username
  }

  public get currentlyTypingUsers(): CurrentlyTypingUsers {
    return this._currentlyTypingUsers;
  }

  // Setters
  public addUser(username: string, password: string) {
    this._users[username.trim()] = {
      password
    };
  }

  public addCurrentlyTypingUser(username: string) {
    this._currentlyTypingUsers[username.trim()] = true;
  }

  public removeCurrentlyTypingUser(username: string) {
    delete this._currentlyTypingUsers[username.trim()];
  }

  public getUsernamesStr(): string {
    return JSON.stringify(Object.keys(this._currentlyTypingUsers));
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

  // socket.on(CONFIG.ADD_USER, (username: string) => {
  //   console.log(`New user: ${username}`);
  //   db.users[username] = {true};
  //   socket.broadcast.emit(CONFIG.USER_ADDED, username);
  // });

  socket.on(CONFIG.USER_TYPING_FROM_FRONTEND, (username: string) => {
    db.addCurrentlyTypingUser(username);

    const usersTypingMsg = db.getUsernamesStr();
    socket.broadcast.emit(CONFIG.USERS_TYPING_FROM_BACKEND, usersTypingMsg);
  });

  socket.on(CONFIG.USER_STOPPED_TYPING_FROM_FRONTEND, (username: string) => {
    db.removeCurrentlyTypingUser(username);

    const usersTypingMsg = db.getUsernamesStr();
    socket.broadcast.emit(CONFIG.USERS_TYPING_FROM_BACKEND, usersTypingMsg);
  });
});

// ---------------------------------

app.get("/health-check", (_, res) => {
  res.send("Hello world!!!!");
});

app.post("/signup", async (req, res)=>{

  console.log(req)

  const { username, password } = req.body

  // Check username already exists
  const usernameExists = db.checkUserExists(username)

  if( usernameExists ){
    return res.status(400).json({
      ok: false,
      err: {
        message: "Usename already Exists"
      }
    })
  }

  // Add user to db

  db.addUser(username, password)

  res.json({
    ok: true
  })

})

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
