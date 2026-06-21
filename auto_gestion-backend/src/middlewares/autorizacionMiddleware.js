const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Usamos req.usuario (coincidiendo con authMiddleware)
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ success: false, message: "Acceso denegado: No tienes permisos suficientes." });
    }
    next();
  };
};

module.exports = verificarRol;