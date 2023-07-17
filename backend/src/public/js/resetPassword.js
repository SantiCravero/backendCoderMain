const restorePasswordForm = document.getElementById("restorePassword");

restorePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const passwordVerification = document.getElementById("reset-password").value;

  if (password === passwordVerification) {
    try {
      const url = "http://localhost:5000/api/session/password/reset";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password, confirmPassword: password }),
      });
      if (!response.ok) {
        return Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Error en la solicitud de restablecer la contraseña`,
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Se restableció la contraseña correctamente',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = `http://localhost:5000/login`;
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: error,
        showConfirmButton: false,
        timer: 2000
      })
  }} else {
    Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Las contraseñas no coinciden',
    showConfirmButton: false,
    timer: 2000
    })
}
})
