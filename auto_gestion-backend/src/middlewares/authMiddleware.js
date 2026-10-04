const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Soporte de bypass para pruebas locales con cualquiera de las dos cabeceras
  const roleHeader = req.headers['x-role'] || req.headers['x-test-role'];
  if (roleHeader) {
    req.usuario = { 
      rol: isNaN(roleHeader) ? roleHeader : parseInt(roleHeader), 
      rol_id: parseInt(roleHeader) || 1 
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
    const decoded = jwt.verify(token, secretKey);
    
    req.usuario = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;