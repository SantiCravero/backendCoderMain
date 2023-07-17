const form = document.getElementById("formGroup");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cliente = { email, password };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(cliente).toString(),
  };

  fetch("/api/session/login", options).then((response) => {
    if (!response.ok) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `Usuario o contraseña incorrectos`,
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Inicio de sesion exitoso',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = `/product`;
      });
    }
  });
});
