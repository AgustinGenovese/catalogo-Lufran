const express = require("express");
const router = express.Router();
const {
  mostrarIndex,
  mostrarFavoritos,
  mostrarLogin,
  procesarLogin,
  mostrarPanel,
  logout,
  
} = require("../controllers/pagesController");

const { protegerRuta, redirigirSiAutenticado } = require("../middlewares/authMiddleware");

// Rutas públicas
router.get("/", mostrarIndex);
router.get("/favoritos", mostrarFavoritos);
router.get("/login", redirigirSiAutenticado, mostrarLogin);
router.post("/login", procesarLogin);// Rutas protegidas
router.get("/panel_carga", protegerRuta, mostrarPanel);

// Logout
router.get("/logout", logout);

module.exports = router;