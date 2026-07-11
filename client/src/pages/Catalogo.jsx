import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { obtenerProductos } from "../api/client.js";
import { useFavoritos } from "../context/FavoritosContext.jsx";
import { WHATSAPP_NUMBER } from "../config.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria") || "todos";
  const { agregar } = useFavoritos();

  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  const productosFiltrados = useMemo(() => {
    if (categoria === "todos") return productos;
    return productos.filter((p) => p.categoria === categoria);
  }, [productos, categoria]);

  const titulo =
    categoria === "todos"
      ? "Todos los Productos"
      : categoria.charAt(0).toUpperCase() + categoria.slice(1);

  const solicitarInformacion = (producto) => {
    const mensaje =
      "Hola! Me interesa recibir más información sobre este producto:\n\n" +
      `- ${producto.nombre}\n`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (cargando) return <h2 className="titulo-principal">Cargando...</h2>;

  return (
    <>
      <h2 className="titulo-principal">{titulo}</h2>
      <div className="contenedor-productos">
        {productosFiltrados.map((producto) => (
          <ProductCard
            key={producto._id}
            producto={producto}
            onAgregar={() => agregar(producto)}
            onInformacion={() => solicitarInformacion(producto)}
          />
        ))}
      </div>
    </>
  );
}
