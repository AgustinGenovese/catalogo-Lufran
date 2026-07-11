import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import Login from "./pages/Login.jsx";
import Panel from "./pages/Panel.jsx";
import { verificarSesion } from "./api/client.js";

function PanelProtegido() {
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    verificarSesion()
      .then(() => setEstado("ok"))
      .catch(() => setEstado("no"));
  }, []);

  if (estado === "cargando") return <p className="titulo-principal">Cargando...</p>;
  if (estado === "no") return <Navigate to="/login" replace />;
  return <Panel />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/panel" element={<PanelProtegido />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
