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

            <article class="product">
				<header>
					<a class="remove">
						<img src="${singleProduct.thumbnails[0]}" alt="${singleProduct.title}">
						<a id="btnBorrar${singleProduct._id}"><h3>Eliminar producto</h3></a>
					</a>
				</header>

				<div class="content">
					<h1>${singleProduct.title}</h1>
					${singleProduct.description}
				</div>

				<footer class="content">
					<span id="menosCant${singleProduct._id}" class="qt-minus">-</span>
					<span class="qt">${product.quantity}</span>
					<span id="masCant${singleProduct._id}" class="qt-plus">+</span>

					<h2 class="full-price"> $ ${singleProduct.price * product.quantity}</h2>
					<h2 class="price">$ ${singleProduct.price}</h2>
				</footer>
			</article>

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








