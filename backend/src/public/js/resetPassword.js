const restorePasswordForm = document.getElementById("restorePassword");

restorePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const passwordVerification = document.getElementById("reset-password").value;

  if (password === passwordVerification) {
    const url = "http://localhost:5000/api/session/password/reset";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password, confirmPassword: password }),
    });
    if (response.ok) {
      window.location.href = "http://localhost:5000/login";
    } else {
      alert("Error en la solicitud de restablecer la contraseña");
    }
  }
});
