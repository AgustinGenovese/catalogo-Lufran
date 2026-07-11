export default function ProductCard({ producto, onAgregar, onInformacion }) {
  return (
    <div className="producto">
      <img className="producto-imagen" src={producto.imagen} alt={producto.nombre} />
      <div className="producto-detalles">
        <h3 className="producto-titulo">{producto.nombre}</h3>
        <p className="producto-descripcion">{producto.descripcion}</p>
        <span className="producto-precio">${producto.precio}</span>
        <button className="producto-informacion" onClick={onInformacion}>
          Solicitar informacion
        </button>
        <button className="producto-agregar" onClick={onAgregar}>
          Agregar a Favoritos
        </button>
      </div>
    </div>
  );
}
