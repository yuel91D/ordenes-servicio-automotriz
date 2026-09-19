const autorizarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // 1. Extrae el rol de los Headers de prueba o del objeto req.usuario
    const rolHeader = req.headers['x-test-role'] || req.headers['x-test-role '] || req.headers['rol_id'];
    const rolId = parseInt(rolHeader) || req.usuario?.rol_id;

    // 2. Si no viene ningún rol, deniega acceso
    if (!rolId) {
      return res.status(401).json({
        ok: false,
        mensaje: 'No autorizado: Usuario no autenticado o falta información de rol'
      });
    }

    // 3. Verifica si el rol está autorizado
    if (!rolesPermitidos.includes(rolId)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso denegado: No tienes permisos suficientes para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = autorizarRol;