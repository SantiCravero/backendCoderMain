const socket = io.connect();

const form = document.getElementById("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("text");
const chat = document.getElementById("chat");

// Envio data al servidor

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (name.value && email.value && message.value) {
    const newMessage = {
      name: name.value,
      email: email.value,
      message: message.value,
    };
    socket.emit("message", newMessage);
    message.value = "";
  } else {
    const error = document.getElementById("error");
    error.innerHTML = `<strong>*Debes completar todos los campos para enviar un mensaje</strong>`;
  }
});

// Recibo la data del servidor y la muestro

socket.on("allMessages", async (message) => {
  chat.innerHTML = "";
  await message.forEach((msg) => {
    chat.innerHTML += `
        <div class="flexChat">
            <strong class="ms-2">${msg.name} </strong> : <p class="mx-2"> ${msg.message}</p>
        </div>
        `;
  });
});
