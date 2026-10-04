const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Bypass automático para pruebas locales con Postman
    if (req.headers['x-role'] || req.headers['x-test-role']) {
      return next();
    }

    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ success: false, message: "Acceso denegado: No tienes permisos suficientes." });
    }
    next();
  };
};

module.exports = verificarRol;