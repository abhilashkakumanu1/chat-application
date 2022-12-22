const msgElement = document.getElementById("messages");
const formElement = document.getElementById("submit-form");
const inputBoxElement = document.getElementById("inputMessage");

// TODO: Figure out a way to have these common for FE & BE
const CONFIG = {
  FROM_FRONTEND: "message from frontend",
  FROM_BACKEND: "message from backend",
};

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputBoxElement.value;
  inputBoxElement.value = "";

  socket.emit(CONFIG.FROM_FRONTEND, text);
});

// Subscribe to broadcast
socket.on(CONFIG.FROM_BACKEND, (msg) => {
  addMessageToScreen(msg);
});

function addMessageToScreen(message) {
  const messageBox = document.createElement("div");
  const textEle = document.createElement("p");
  textEle.classList.add("message");

  textEle.innerText = message;

  messageBox.appendChild(textEle);

  msgElement.appendChild(messageBox);
}

socketFunc();
