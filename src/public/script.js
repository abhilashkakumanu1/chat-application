const msgElement = document.getElementById("messages");
const formElement = document.getElementById("submit-form");
const inputBoxElement = document.getElementById("inputMessage");

// Global variables
let USERNAME;

// TODO: Figure out a way to have these common for FE & BE
const CONFIG = {
  MESSAGE_FROM_FRONTEND: "message from frontend",
  MESSAGE_FROM_BACKEND: "message from backend",
  ADD_USER: "add new user",
  USER_ADDED: "new user successfully added",
};

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputBoxElement.value;
  inputBoxElement.value = "";

  socket.emit(CONFIG.MESSAGE_FROM_FRONTEND, text);
});

// Subscribe to broadcast
socket.on(CONFIG.MESSAGE_FROM_BACKEND, (msg) => {
  addMessageToScreen(msg);
});

// Subscribe to broadcast
socket.on(CONFIG.USER_ADDED, (username) => {
  addNewUserMessageToScreen(username);
});

function addMessageToScreen(message) {
  const messageBox = document.createElement("div");
  const textEle = document.createElement("p");
  textEle.classList.add("message");
  textEle.innerText = message;
  messageBox.appendChild(textEle);
  msgElement.appendChild(messageBox);
}

function addNewUserMessageToScreen(username) {
  const messageBox = document.createElement("div");
  const textEle = document.createElement("p");
  textEle.classList.add("user-added");
  textEle.innerText = `New user added: ${username}....`;
  messageBox.appendChild(textEle);
  msgElement.appendChild(messageBox);
}

function onLoad() {
  USERNAME = prompt("Enter username");

  // Send username to backend
  socket.emit(CONFIG.ADD_USER, USERNAME);
}

onLoad();
