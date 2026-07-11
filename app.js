require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const productoRoutes = require("./routes/productoRoutes");
const authRoutes = require("./routes/authRoutes");

const conectarDB = require("./config/db");

conectarDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
);

app.use("/api", productoRoutes);
app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

module.exports = app;
