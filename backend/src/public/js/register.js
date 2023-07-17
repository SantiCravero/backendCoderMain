const form = document.getElementById('registerForm')

form.addEventListener('submit', e => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = {}

    for (const [key, value] of formData.entries()) {
        data[key] = value
    }
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    }

    fetch('http://localhost:5000/api/session/register', options)
        .then(response => {
            if (!response.ok) {
                return Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error:`,
                    showConfirmButton: false,
                    timer: 1500
                })    
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Usuario creado con exito',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = `/login`;
                });
            }
        })
})