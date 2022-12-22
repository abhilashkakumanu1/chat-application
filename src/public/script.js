const msgElement = document.getElementById("messages");
const formElement = document.getElementById("submit-form");
const inputBoxElement = document.getElementById("inputMessage");

const { FROM_FRONTEND = "message from frontend", FROM_BACKEND ="message from backend" } = process.env

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputBoxElement.value;
  inputBoxElement.value = "";

  console.log(CHANNELS)

  socket.emit(CHANNELS.FROM_FRONTEND, text)

  socket.on(CHANNELS.FROM_BACKEND, (msg)=>{
    addMessageToScreen(msg);
  })

});

function addMessageToScreen(message) {
  const messageBox = document.createElement("div");
  const textEle = document.createElement("p");
  textEle.classList.add("message");

  textEle.innerText = message;

  messageBox.appendChild(textEle);

  msgElement.appendChild(messageBox);
}

function socketFunc() {
  const socket = io();
}

socketFunc();
