const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector(".titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

let productos = [];

let productosEnFavoritos = JSON.parse(localStorage.getItem("productos-en-favoritos")) || [];

actualizarNumerito();

async function obtenerProductos() {
    try {
        const respuesta = await fetch("api/productos");
        const data = await respuesta.json();

        productos = data;
        cargarProductos(productos);
    } catch (error) {
        console.error("Error al traer productos:", error);
    }
}

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
          <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
          <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <span style="display:inline-block; margin:1rem auto; text-align:center; background:#F9F8F4; color:#8C7A5B; padding:6px 12px; border-radius:10px; font-weight:600; font-size:1rem;">
                $100.000
            </span>
            <button class="producto-agregar" id="${producto._id}">
              Agregar a Favoritos
            </button>
          </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const categoriaSeleccionada = e.currentTarget.id;

        if (categoriaSeleccionada !== "todos") {
            const productosFiltrados = productos.filter(
                producto => producto.categoria === categoriaSeleccionada
            );

            tituloPrincipal.innerText = categoriaSeleccionada.charAt(0).toUpperCase() + categoriaSeleccionada.slice(1);
            cargarProductos(productosFiltrados);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});


function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAFavoritos);
    });
}

function agregarAFavoritos(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto._id === idBoton);

    if (productosEnFavoritos.some(producto => producto._id === idBoton)) {
        return;
    }

    productosEnFavoritos.push(productoAgregado);

    actualizarNumerito();

    localStorage.setItem("productos-en-favoritos", JSON.stringify(productosEnFavoritos));
}

function actualizarNumerito() {
    numerito.innerText = productosEnFavoritos.length;
}

obtenerProductos();
