const showProfile = async()=>{
    const response = await fetch(`http://localhost:5000/api/session/current`, {
        method: 'GET',
    });
    const profileDiv = document.getElementById('profile')
    
    const jsonResponse = await response.json()
    const user = jsonResponse.user;
    let item = document.createElement("div");
    let itemContent = ""
    if (!user){
        itemContent = `
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
                <div class="">
                    <h2>Debe loguearse para acceder a estos datos</h2>
                </div>
            </div>
        </div>            
        `;
    }else{
        itemContent = `
        <div class="d-flex align-items-center">
            <div class="card-body p-4 bg-white rounded my-4 w-50">
                <div class="row d-flex justify-content-between align-items-center">
                    <div>
                        <h3>Nombre</h3>
                        <p class="lead fw-normal mb-2">${user.first_name}</p>
                        <h3>Apellido</h3>
                        <p class="lead fw-normal mb-2">${user.last_name}</p>
                        <h3>Email</h3>
                        <p class="lead fw-normal mb-2">${user.email}</p>
                    </div>
                </div>
            </div> 
            <div class="card-body ms-5">
                <button id="btnLogout" type="button" class="btn btn-warning btn-block btn-lg text-center">Logout</button>
            </div>           
        </div>
        `;
    }

    item.innerHTML = itemContent;
    profileDiv.appendChild(item)
    document.getElementById('btnLogout').addEventListener('click',async()=>{
        const logoutResponse = await fetch(`http://localhost:5000/api/session/logout`, {
            method: 'GET',
        });
        const logoutResponseJson = await logoutResponse.json()
        console.log(logoutResponseJson)
        if (!logoutResponse.ok){
            return Swal.fire({
                position: 'center',
                icon: 'error',
                title: `${logoutResponseJson.message}`,
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = `http://localhost:5000/login`;
            })
        }else{
            return Swal.fire({
                position: 'center',
                icon: 'success',
                title: `${logoutResponseJson.message}`,
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = `http://localhost:5000/login`;
            })
        }
 
    })
}

showProfile();