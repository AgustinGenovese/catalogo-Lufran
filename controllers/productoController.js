const Producto = require("../models/Producto");

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, imagen, categoria } = req.body;

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      imagen,
      categoria
    });

    await nuevoProducto.save();

    res.redirect("/panel_carga");
  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).send("Error al guardar producto");
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto); // 👉 devolvemos directo el objeto
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagen, categoria } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, imagen, categoria },
      { new: true } // devuelve el objeto ya actualizado
    );

    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(productoActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};


const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto };
