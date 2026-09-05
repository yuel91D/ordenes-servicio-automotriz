const repository = require('../repositories/passwordResetRepository');

const passwordResetService = {
  solicitarRecuperacion: async (email, token) => {
    // Aquí iría la lógica: generar token, guardar, enviar correo...
    return await repository.create({ email, token, expiracion: new Date(Date.now() + 3600000) });
  }
};
module.exports = passwordResetService;