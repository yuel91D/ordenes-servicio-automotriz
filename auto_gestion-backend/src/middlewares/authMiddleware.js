const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtenemos el header de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });
  }

  // Extraemos el token del formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token usando tu clave secreta (asegúrate de tenerla en .env)
    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
    const decoded = jwt.verify(token, secretKey);
    
    // Guardamos los datos del usuario en la request para usarlos en el controlador
    req.usuario = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;