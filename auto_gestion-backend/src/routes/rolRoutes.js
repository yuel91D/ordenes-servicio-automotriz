const express = require('express');
const router = express.Router();
const rolService = require('../services/rolService');
const verificarToken = require('../middlewares/authMiddleware');

// Listar Roles
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

// Crear Rol
router.post('/', verificarToken, async (req, res, next) => {
  try {
    const nuevoRol = await rolService.crearRol(req.body);
    res.status(201).json({
      success: true,
      message: 'Rol creado con éxito',
      data: nuevoRol
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar Rol
router.put('/:id', verificarToken, async (req, res, next) => {
  try {
    const rolActualizado = await rolService.actualizarRol(req.params.id, req.body);
    if (!rolActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Rol actualizado con éxito',
      data: rolActualizado
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar Rol
router.delete('/:id', verificarToken, async (req, res, next) => {
  try {
    const eliminado = await rolService.eliminarRol(req.params.id);
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Rol eliminado con éxito'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;