const validarEsquema = (schema) => {
  return (req, res, next) => {
    // validate() analiza req.body contra las reglas definidas
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Extraemos todos los mensajes de error legibles
      const detalles = error.details.map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: 'Error de validación en los datos enviados',
        errors: detalles
      });
    }

    // Si todo está perfecto, continúa al controlador
    next();
  };
};

module.exports = validarEsquema;