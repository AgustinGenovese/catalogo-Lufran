import { useState } from "react";
import { NavLink, Link, Outlet, useSearchParams } from "react-router-dom";
import { useFavoritos } from "../context/FavoritosContext.jsx";

const CATEGORIAS = [
  { id: "escritorios", label: "Escritorios" },
  { id: "mesitas", label: "Mesitas de Luz" },
  { id: "bibliotecas", label: "Bibliotecas" },
  { id: "sillas", label: "Sillas" }
];

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { favoritos } = useFavoritos();
  const [searchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "todos";

  return (
    <div className="wrapper">
      <header className="header-mobile">
        <h1 className="logo">Catálogo</h1>
        <button className="open-menu" onClick={() => setMenuAbierto(true)}>
          <i className="bi bi-list"></i>
        </button>
      </header>

      <aside className={menuAbierto ? "aside-visible" : ""}>
        <button className="close-menu" onClick={() => setMenuAbierto(false)}>
          <i className="bi bi-x"></i>
        </button>
        <header>
          <h1 className="logo">Catálogo</h1>
        </header>
        <nav>
          <ul className="menu">
            <li>
              <Link
                to="/"
                className={`boton-menu boton-categoria ${categoriaActiva === "todos" ? "active" : ""}`}
                onClick={() => setMenuAbierto(false)}
              >
                <i className="bi bi-hand-index-thumb-fill"></i> Todos los Productos
              </Link>
            </li>
            {CATEGORIAS.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/?categoria=${cat.id}`}
                  className={`boton-menu boton-categoria ${categoriaActiva === cat.id ? "active" : ""}`}
                  onClick={() => setMenuAbierto(false)}
                >
                  <i className="bi bi-hand-index-thumb"></i> {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <NavLink
                to="/favoritos"
                className={({ isActive }) =>
                  `boton-menu boton-favoritos ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuAbierto(false)}
              >
                <i className="bi bi-star"></i> Favoritos{" "}
                <span className="numerito">{favoritos.length}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <footer>
          <p className="texto-footer"> © 2025 Genovese Coder </p>
        </footer>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
