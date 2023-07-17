const getCart = async () => {
    const response = await fetch(`http://localhost:5000/api/cart`, {
        method: 'GET',
    });

    const cart = await response.json();
    if (!response.ok) {
        return Swal.fire({
            position: 'center',
            icon: 'error',
            title: `${cart.message}`,
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.href = `http://localhost:5000/login`;
        })
    }
    const cartProducts = cart.cart.products;

    const cartItemsContainer = document.getElementById('cartList')
    let children = cartItemsContainer.childNodes;
    for (let i = children.length - 1; i >= 0; i--) {
        cartItemsContainer.removeChild(children[i]);
    }
    let totalCompra = 0;
    if (cartProducts.length == 0) {
        let item = document.createElement("div");
        let itemContent = `<h2 class="text-center">El carrito esta vacio<h2>`
        cartItemsContainer.classList.add('p-5');
        item.innerHTML = itemContent;
        cartItemsContainer.appendChild(item)
    } else {
        // HTML de vista de productos en carrito
        cartProducts.forEach(product => {
            const singleProduct = product.productId
            totalCompra += singleProduct.price * product.quantity
            let item = document.createElement("div");
            let itemContent = `
            <div class="card-body p-4">
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                        <img src="${singleProduct.thumbnails[0]}" class="img-fluid rounded-3" alt="${singleProduct.title}">
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                        <p class="lead fw-normal mb-2">${singleProduct.title}</p>
                        <div class="d-flex align-items-center">
                            <button id="menosCant${singleProduct._id}" class="btn btn-transparent text-black fs-3 btn-sm me-2">-</button>
                            <span class="text-muted">${product.quantity}</span>
                            <button id="masCant${singleProduct._id}" class="btn btn-transparent text-black fs-3 btn-sm ms-2">+</button>
                        </div>
                        <p class="text-muted">Precio: ${singleProduct.price}</p>
                    </div>
                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 class="mb-0">$ ${singleProduct.price * product.quantity}</h5>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                        <a id="btnBorrar${singleProduct._id}" class="text-danger">Toca aca</i></a>
                    </div>
                </div>
            </div>
            `;

            item.innerHTML = itemContent;
            cartItemsContainer.appendChild(item)

            // Boton de sumar cantidad
            document.getElementById(`masCant${singleProduct._id}`).addEventListener('click', async () => {
                const masCantResponse = await fetch(`http://localhost:5000/api/cart/product/${singleProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: product.quantity + 1 })
                });
                const sumarMessage = await masCantResponse.json()
                if (!masCantResponse.ok) {
                    return Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: `${sumarMessage.message}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
                getCart()
            })

            // Boton de restar cantidad
            document.getElementById(`menosCant${singleProduct._id}`).addEventListener('click', async () => {
                const menosCantResponse = await fetch(`http://localhost:5000/api/cart/product/${singleProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: product.quantity - 1 })
                });
                const restarMessage = await menosCantResponse.json()
                if (!menosCantResponse.ok) {
                    return Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: `${restarMessage.message}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
                getCart()
            })

            // Boton para eliminar un producto
            document.getElementById(`btnBorrar${singleProduct._id}`).addEventListener("click", async () => {
                const deleteAction = await fetch(`http://localhost:5000/api/cart/product/${singleProduct._id}`, {
                    method: 'DELETE',
                })
                const deleteResponse = await deleteAction.json()
                if (!deleteAction.ok) {
                    return Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `${deleteResponse.message}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `${deleteResponse.message}`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    getCart()
                })
            })
        });
    }
    document.getElementById('totalCompra').innerText = "Total: $" + totalCompra
}

// Boton para generar ticket
document.getElementById('checkoutButton').addEventListener('click', async (e) => {
    e.preventDefault();
    const ticketResponse = await fetch(`http://localhost:5000/api/cart/purchase`, {
        method: 'POST',
    });
    const checkoutJson = await ticketResponse.json()

    if (!ticketResponse.ok) {
        return Swal.fire({
            position: 'center',
            icon: 'error',
            title: `${checkoutJson}`,
            showConfirmButton: false,
            timer: 2000
        })
    }

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `${checkoutJson.message}`,
        showConfirmButton: false,
        timer: 2000
    }).then(() => {
        window.location.href = `http://localhost:5000/product`;
    })
})


getCart()








