import React from "react";
import "./Chat.css"

function Chat() {
  return (
    <div id="containerPadre">
      <div id="formContainer">
        <form id="form">
          <input type="text" id="name" placeholder="Nombre" />
          <input type="text" id="email" placeholder="Dirección de correo" />
          <input type="text" id="text" placeholder="Mensaje" />
          <div id="botonEnviar">
            <button className="btn btn-primary">Enviar</button>
          </div>
          <p id="error" className="text-center text-danger mt-3"></p>
        </form>
      </div>
      <div id="chat"></div>
    </div>
  );
}

export default Chat;
