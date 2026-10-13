const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

router.use(authMiddleware);

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

// GET: Listar todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.status(200).json({ success: true, total: usuarios.length, usuarios });
  } catch (error) { next(error); }
});

// POST: Crear un nuevo usuario
router.post('/', async (req, res, next) => {
  try {
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre_completo: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
        rol_id: nuevoUsuario.rol_id
      }
    });
  } catch (error) {
    if (error.status === 400 || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message || (error.errors ? error.errors.map(e => e.message).join(', ') : 'Error de validación.')
      });
    }
    next(error);
  }
});

// PUT: Actualizar un usuario por ID
router.put('/:id', async (req, res, next) => {
  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    if (!usuarioActualizado) {
      return res.status(404).json({ success: false, message: 'Usuario no existe.' });
    }
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: {
        id: usuarioActualizado.id,
        nombre_completo: usuarioActualizado.nombre_completo,
        email: usuarioActualizado.email,
        rol_id: usuarioActualizado.rol_id
      }
    });
  } catch (error) {
    if (error.status === 400 || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error de validación.'
      });
    }
    next(error);
  }
});

// DELETE: Eliminar un usuario por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const eliminado = await usuarioService.eliminarUsuario(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, message: 'Usuario no existe.' });
    }
    res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) { next(error); }
});

module.exports = router;