const mostrarIndex = (req, res) => {
  res.render("index");
};

const mostrarFavoritos = (req, res) => {
  res.render("favoritos");
};

const mostrarLogin = (req, res) => {
  res.render("login", { error: null });
};

const procesarLogin = (req, res) => {
  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "REEMPLAZADA") {
    req.session.autenticado = true;
    return res.redirect("/panel_carga");
  }

  res.render("login", { error: "Usuario o contraseña incorrectos" });
};

const mostrarPanel = (req, res) => {
  res.render("panel_carga");
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = {
  mostrarIndex,
  mostrarFavoritos,
  mostrarLogin,
  procesarLogin,
  mostrarPanel,
  logout
};
