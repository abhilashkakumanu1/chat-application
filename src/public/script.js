const msgElement = document.getElementById("messages");
const formElement = document.getElementById("submit-form");
const inputBoxElement = document.getElementById("inputMessage");
const userTypingElement = document.getElementById("userTyping");

// Global variables
let USERNAME;

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

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputBoxElement.value;
  inputBoxElement.value = "";

  socket.emit(CONFIG.MESSAGE_FROM_FRONTEND, text);
});

// user typing...functionality
inputBoxElement.addEventListener("focusin", (_) => {
  socket.emit(CONFIG.USER_TYPING_FROM_FRONTEND, USERNAME);
});
inputBoxElement.add_Listener("focusout", (_) => {
  socket.emit(CONFIG.USER_STOPPED_TYPING_FROM_FRONTEND, USERNAME);
});

// Subscribe to new message
socket.on(CONFIG.MESSAGE_FROM_BACKEND, (msg) => {
  addMessageToScreen(msg);
});

// Subscribe to user added
socket.on(CONFIG.USER_ADDED, (username) => {
  addNewUserMessageToScreen(username);
});

// Subscribe to users typing
socket.on(CONFIG.USERS_TYPING_FROM_BACKEND, (msg) => {
  updateUserTypingMessage(msg);
});

function addMessageToScreen(message) {
  addTextBox("message", message);
}

function addNewUserMessageToScreen(username) {
  addTextBox("user-created", username);
}

function updateUserTypingMessage(msg) {
  userTypingElement.innerText = msg;
}

function addTextBox(className, text) {
  const messageBox = document.createElement("div");
  const textEle = document.createElement("p");
  textEle.classList.add(className);
  textEle.innerText = text;
  messageBox.appendChild(textEle);
  msgElement.appendChild(messageBox);
}

function onLoad() {
  USERNAME = prompt("Enter username");

  // Send username to backend
  socket.emit(CONFIG.ADD_USER, USERNAME);
}

onLoad();
