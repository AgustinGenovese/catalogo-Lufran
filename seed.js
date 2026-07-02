require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("./models/Producto");

const productos = [
  { nombre: "Escritario Nórdico", descripcion: "Escritorio de madera maciza con acabado natural. Ideal para home office.", imagen: "/images/escritorio-1.png", categoria: "escritorios", precio: "45000" },
  { nombre: "Escritorio Ejecutivo", descripcion: "Escritorio amplio con cajones laterales y superficie de nogal.", imagen: "/images/escritorio-2.png", categoria: "escritorios", precio: "62000" },
  { nombre: "Escritorio Compacto", descripcion: "Escritorio minimalista de líneas rectas, perfecto para espacios pequeños.", imagen: "/images/escritorio-3.png", categoria: "escritorios", precio: "38000" },
  { nombre: "Mesita de Luz Clásica", descripcion: "Mesita de luz con dos cajones y tiradores dorados.", imagen: "/images/mesita_de_luz_1.png", categoria: "mesitas", precio: "18500" },
  { nombre: "Mesita de Luz Moderna", descripcion: "Mesita de luz flotante con espacio inferior abierto.", imagen: "/images/mesita_de_luz_2.png", categoria: "mesitas", precio: "16000" },
  { nombre: "Biblioteca Rústica", descripcion: "Biblioteca de pino macizo con seis estantes regulables.", imagen: "/images/biblioteca-1.png", categoria: "bibliotecas", precio: "78000" },
  { nombre: "Biblioteca Modular", descripcion: "Biblioteca moderna en blanco con módulos apilables.", imagen: "/images/biblioteca-2.png", categoria: "bibliotecas", precio: "72000" },
  { nombre: "Silla de Comedor", descripcion: "Silla tapizada con patas de madera sólida.", imagen: "/images/silla-1.png", categoria: "sillas", precio: "22000" },
  { nombre: "Silla Escritorio Ergonómica", descripcion: "Silla con respaldo curvo y asiento acolchonado.", imagen: "/images/silla-2.png", categoria: "sillas", precio: "28000" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    await Producto.deleteMany({});
    console.log("Productos existentes eliminados");

    await Producto.insertMany(productos);
    console.log(`${productos.length} productos insertados`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada");
  }
}

seed();
