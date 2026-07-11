import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  logout
} from "../api/client.js";

const VACIO = { nombre: "", descripcion: "", imagen: "", categoria: "", precio: "" };

export default function Panel() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);

  const cargar = () =>
    obtenerProductos().then(setProductos).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await actualizarProducto(editandoId, form);
      } else {
        await crearProducto(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = async (id) => {
    const p = await obtenerProducto(id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      imagen: p.imagen || "",
      categoria: p.categoria,
      precio: p.precio
    });
    setEditandoId(id);
  };

  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    cargar();
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="panel-page">
      <h1>Gestión de Productos</h1>
      <div className="panel-layout">
        <div>
          <form id="formProducto" onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />

            <label htmlFor="imagen">URL de imagen</label>
            <input
              type="url"
              id="imagen"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://..."
            />

            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            />

            <label htmlFor="precio">Precio</label>
            <input
              type="text"
              id="precio"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
            />

            <div className="btn-group">
              <button id="btnAgregar" type="submit">
                {editandoId ? "Guardar cambios" : "Agregar"}
              </button>
              <button
                id="btnAceptar"
                type="button"
                disabled={!editandoId}
                onClick={() => {
                  setForm(VACIO);
                  setEditandoId(null);
                }}
              >
                Aceptar
              </button>
            </div>

            <div className="panel-links">
              <Link to="/">← Volver al inicio</Link>
              <a href="#" onClick={handleLogout}>
                Cerrar sesión
              </a>
            </div>
          </form>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cat.</th>
                <th>Precio</th>
                <th>Img</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio}</td>
                  <td>
                    <img src={p.imagen || ""} alt={p.nombre} />
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="editar" onClick={() => handleEditar(p._id)}>
                        Editar
                      </button>
                      <button className="eliminar" onClick={() => handleEliminar(p._id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
