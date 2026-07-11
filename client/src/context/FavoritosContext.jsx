import { createContext, useContext, useEffect, useState } from "react";

const FavoritosContext = createContext(null);
const STORAGE_KEY = "productos-en-favoritos";

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  }, [favoritos]);

  const agregar = (producto) => {
    setFavoritos((prev) =>
      prev.some((p) => p._id === producto._id) ? prev : [...prev, producto]
    );
  };

  const eliminar = (id) => {
    setFavoritos((prev) => prev.filter((p) => p._id !== id));
  };

  const vaciar = () => setFavoritos([]);

  return (
    <FavoritosContext.Provider value={{ favoritos, agregar, eliminar, vaciar }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return ctx;
}
