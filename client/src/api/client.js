const BASE = "/api";

async function request(url, options = {}) {
  const res = await fetch(BASE + url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error de red");
  }

  return res.json();
}

export const obtenerProductos = () => request("/productos");
export const obtenerProducto = (id) => request(`/productos/id/${id}`);
export const crearProducto = (data) =>
  request("/productos", { method: "POST", body: JSON.stringify(data) });
export const actualizarProducto = (id, data) =>
  request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const eliminarProducto = (id) =>
  request(`/productos/${id}`, { method: "DELETE" });

export const login = (usuario, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ usuario, password }) });
export const logout = () => request("/auth/logout", { method: "POST" });
export const verificarSesion = () => request("/auth/me");
