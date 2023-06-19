const sendMailForm = document.getElementById("sendMailForm")
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

    if (response.ok){
      alert("Le enviamos el instructivo para cambiar su contraseña. Revisa su correo electronico")
    }
    const data = await response.json();
    console.log(data);
    
  }
)