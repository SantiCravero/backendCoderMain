const form = document.getElementById('form-register')

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

    fetch('/api/session/register', options)
        .then(response => {
            if (response.ok) {
                window.location.href = '/login'
            } else {
                throw new Error('Error al crear cuenta')
            }
        })
})