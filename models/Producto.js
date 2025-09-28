const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagen: { type: String },
  categoria: { type: String, required: true, lowercase: true },
  precio: { type: String }
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;