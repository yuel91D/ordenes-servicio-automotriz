const express = require('express');
const router = express.Router();
const rolService = require('../services/rolService');
const verificarToken = require('../middlewares/authMiddleware'); // O el middleware que uses para validar el token

router.get('/', verificarToken, async (req, res, next) => {
  try {
    const roles = await rolService.obtenerRoles();
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;