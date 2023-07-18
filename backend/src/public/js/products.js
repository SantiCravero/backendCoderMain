const showProducts = async () => {
    const response = await fetch(`http://localhost:5000/api/product`, {
        method: 'GET'
    });
    const productJson = await response.json();
    const products = productJson.docs;
    let productContainer = document.getElementById("divProducts");
    
    products.forEach((product) => {
        let card = document.createElement("div");
        card.classList.add("col-md-4"); 

        let imgUrl = "";

        if (product.thumbnails.length > 0) {
            if (product.thumbnails[0].length > 0) {
                imgUrl = product.thumbnails[0];
            } else {
                imgUrl = "/img/imagen-no-disponible.jpg";
            }
        }
        else {
            imgUrl = "/img/imagen-no-disponible.jpg";
        }

        let cardContent = `  
                <li class="product">
                    <botton>
                        <span class="onsale">Sale!</span>
                        <img alt="${product.title}" class="attachment-shop_catalog " src="${imgUrl}" />
                        <h3 class="fs-4 py-3">${product.title}</h3>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="amount fs-6 my-0">Stock: ${product.stock}</span>
                            <span class="price d-flex align-items-center">
                                <ins> <span class="amount text-black fs-5">$ ${product.price}</span> </ins>
                                <span class="sale-tag sale-tag-square">-7%</span>
                            </span>
                        </div>
                    </botton>
                    <button href="" id="btn${product._id}" class="btn btn-dark btn-circle btn-review" data-toggle="tooltip" data-placement="top" title="Quick View"><i class="ion ion-ios-move"></i></button>
                </li>    
                `;
        card.innerHTML = cardContent;
        productContainer.appendChild(card);
        
        // Boton para agregar al carrito
        document.getElementById(`btn${product._id}`).addEventListener("click", async (e) => {
            e.preventDefault();
            const productAddResponse = await fetch(`http://localhost:5000/api/cart/product/${product._id}`, {
                method: 'POST'
            });
            const prodJson = await productAddResponse.json();
            if (productAddResponse.status === 401) {
                return Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Debe loguearse para realizar una compra`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = `http://localhost:5000/login`;
                })
            }
            if (!productAddResponse.ok) {
                return Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error: ${prodJson.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            return Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Se ha agregado el producto con exito`,
                showConfirmButton: false,
                timer: 2000
            })
        })
    });
};

showProducts();