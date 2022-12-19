const msgElement = document.getElementById("messages");
const formElement = document.getElementById("submit-form");
const inputBoxElement = document.getElementById("inputMessage");

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputBoxElement.value;
  inputBoxElement.value = "";

  addMessageToScreen(text);
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
