const protegerRuta = (req, res, next) => {
  if (req.session && req.session.autenticado) {
    return next(); 
  }
  res.redirect("/login"); 
};

const redirigirSiAutenticado = (req, res, next) => {
  if (req.session && req.session.autenticado) {
    return res.redirect("/panel_carga"); 
  }
  next(); 
};

module.exports = { protegerRuta, redirigirSiAutenticado };
