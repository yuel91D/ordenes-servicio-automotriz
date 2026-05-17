// 🛡️ Middleware Global de Errores para Express
const errorMiddleware = (err, req, res, next) => {
  // Si el error ya trae un status definido (como el 400 que creamos), lo usa. 
  // Si es un colapso inesperado (ej. MySQL caído), por defecto asigna 500.
  const statusCode = err.statusCode || 500;
  
  // Mensaje limpio para el cliente de la API
  const message = err.message || "Ocurrió un error interno en el servidor.";

  console.error(`[Error Backend]: ${message}`); // Log para que tú lo veas en la terminal

  return res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorMiddleware;