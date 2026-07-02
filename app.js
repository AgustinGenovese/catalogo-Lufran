require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const pagesRoutes = require("./routes/pagesRoutes");
const productoRoutes = require("./routes/productoRoutes");

const conectarDB = require("./config/db");

conectarDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use("/api", productoRoutes);
app.use("/", pagesRoutes);

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

module.exports = app;
