import { useFavoritos } from "../context/FavoritosContext.jsx";
import { WHATSAPP_NUMBER } from "../config.js";

export default function Favoritos() {
  const { favoritos, eliminar, vaciar } = useFavoritos();

  const enviarWhatsapp = () => {
    let mensaje = "Hola! Me interesa recibir más información sobre estos productos:\n\n";
    favoritos.forEach((p) => {
      mensaje += `- ${p.nombre}\n`;
    });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <h2 className="titulo-principal">Favoritos</h2>
      <div className="contenedor-favoritos">
        {favoritos.length === 0 ? (
          <p className="favoritos-vacio">Tus favoritos están vacíos</p>
        ) : (
          <>
            <div className="favoritos-productos">
              {favoritos.map((producto) => (
                <div className="favoritos-producto" key={producto._id}>
                  <img
                    className="favoritos-producto-imagen"
                    src={producto.imagen}
                    alt={producto.nombre}
                  />
                  <div className="favoritos-producto-titulo">
                    <h3>{producto.nombre}</h3>
                  </div>
                  <div className="favoritos-producto-precio">
                    <span className="producto-precio">${producto.precio}</span>
                  </div>
                  <button
                    className="favoritos-producto-eliminar"
                    onClick={() => eliminar(producto._id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="favoritos-acciones">
              <div className="favoritos-acciones-izquierda">
                <button className="favoritos-acciones-vaciar" onClick={vaciar}>
                  Vaciar Favoritos
                </button>
              </div>
              <div className="favoritos-acciones-derecha">
                <button className="favoritos-acciones-enviar" onClick={enviarWhatsapp}>
                  Solicitar Informacion
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
