const mongoose = require("mongoose");

const conectarDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    throw error;
  }
};

module.exports = conectarDB;