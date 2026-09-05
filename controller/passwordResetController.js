const service = require('../services/passwordResetService');

const passwordResetController = {
  requestReset: async (req, res, next) => {
    try {
      const { email, token } = req.body;
      const result = await service.solicitarRecuperacion(email, token);
      res.json({ success: true, message: "Token generado con éxito." });
    } catch (err) { next(err); }
  }
};
module.exports = passwordResetController;