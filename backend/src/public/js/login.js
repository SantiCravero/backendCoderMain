const form = document.getElementById('formLogin')

form.addEventListener('submit', event => {
    event.preventDefault()
    const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const cliente = { email, password };
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(cliente).toString()
    }   

    fetch('/api/session/login', options)
        .then(response => {
            if (response.ok) {
                window.location.href = '/chat';  // Le hago en redirect a chat porque no tengo la view de product creada
            } else {
                alert("Credenciales inválidas.")
            }
        })
})