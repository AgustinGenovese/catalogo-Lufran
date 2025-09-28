let productosEnFavoritos = JSON.parse(localStorage.getItem("productos-en-favoritos")) || [];

const contenedorFavoritosVacio = document.querySelector("#favoritos-vacio");
const contenedorFavoritosProductos = document.querySelector("#favoritos-productos");
const contenedorFavoritosAcciones = document.querySelector("#favoritos-acciones");
const numerito = document.querySelector(".numerito");

const botonVaciar = document.querySelector(".favoritos-acciones-vaciar");
const botonEnviar = document.querySelector(".favoritos-acciones-enviar");

cargarFavoritos();
actualizarNumerito();

function cargarFavoritos() {
    if (productosEnFavoritos.length > 0) {
        contenedorFavoritosVacio.classList.add("disabled");
        contenedorFavoritosProductos.classList.remove("disabled");
        contenedorFavoritosAcciones.classList.remove("disabled");

        contenedorFavoritosProductos.innerHTML = "";

        productosEnFavoritos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("favoritos-producto");
            div.innerHTML = `
                <img class="favoritos-producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
                <div class="favoritos-producto-titulo">
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="favoritos-producto-descripcion">
                    <span style="display:inline-block; margin:1rem auto; text-align:center; background:#F9F8F4; color:#8C7A5B; padding:6px 12px; border-radius:10px; font-weight:600; font-size:1rem;">
                        $100.000
                    </span>
                </div>
                <button class="favoritos-producto-eliminar" id="${producto._id}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;
            contenedorFavoritosProductos.append(div);
        });

    } else {
        contenedorFavoritosVacio.classList.remove("disabled");
        contenedorFavoritosProductos.classList.add("disabled");
        contenedorFavoritosAcciones.classList.add("disabled");
    }

    actualizarBotonesEliminar();
}

function actualizarNumerito() {
    numerito.innerText = productosEnFavoritos.length;
}

function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".favoritos-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDeFavoritos);
    });
}

function eliminarDeFavoritos(e) {
    const idBoton = e.currentTarget.id;
    productosEnFavoritos = productosEnFavoritos.filter(producto => producto._id !== idBoton);
    localStorage.setItem("productos-en-favoritos", JSON.stringify(productosEnFavoritos));
    cargarFavoritos();
    actualizarNumerito();
}

botonVaciar.addEventListener("click", () => {
    productosEnFavoritos = [];
    localStorage.setItem("productos-en-favoritos", JSON.stringify(productosEnFavoritos));
    cargarFavoritos();
    actualizarNumerito();
});


botonEnviar.addEventListener("click", () => {
    let mensaje = "Hola! Me interesa recibir más información sobre estos productos:\n\n";
    productosEnFavoritos.forEach(p => {
        mensaje += `- ${p.nombre}: ${p.descripcion}\n`;
    });

    const numero = "5491165919418"; 

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
});
