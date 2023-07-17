const sendMailForm = document.getElementById("mailForm")
sendMailForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById("email").value;
    const url = 'http://localhost:5000/api/session/password/createlink';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok){
      return Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Error al restablecer la contraseña`,
        showConfirmButton: false,
        timer: 2000
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: "Le enviamos el instructivo para cambiar su contraseña. Revisa su correo electronico",
        showConfirmButton: false,
        timer: 2000
      })
    }
    const data = await response.json();
    console.log(data);
    
  }
)