const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (
    usuario === process.env.ADMIN_USER &&
    (await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH))
  ) {
    req.session.autenticado = true;
    return res.json({ ok: true });
  }

  return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
};

const me = (req, res) => {
  res.json({ autenticado: !!(req.session && req.session.autenticado) });
};

module.exports = { login, logout, me };
