const express = require("express");
const router = express.Router();
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } = require("../controllers/productoController");
const { protegerRuta } = require("../middlewares/authMiddleware");

router.get("/productos", obtenerProductos)

router.get("/productos/id/:id", obtenerProductoPorId);

router.post("/productos", protegerRuta, crearProducto);

router.put("/productos/:id", protegerRuta, actualizarProducto);

router.delete('/productos/:id', eliminarProducto);

module.exports = router;