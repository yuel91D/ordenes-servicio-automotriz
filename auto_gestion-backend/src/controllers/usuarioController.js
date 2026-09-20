const usuarioService = require('../services/usuarioService');

const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    return res.status(200).json({ success: true, total: usuarios.length, usuarios });
  } catch (error) {
    next(error);
  }
};

const crearUsuario = async (req, res, next) => {
  try {
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    return res.status(201).json({
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
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    if (!usuarioActualizado) {
      return res.status(404).json({ success: false, message: 'Usuario no existe.' });
    }
    return res.status(200).json({
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
};

const eliminarUsuario = async (req, res, next) => {
  try {
    const eliminado = await usuarioService.eliminarUsuario(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, message: 'Usuario no existe.' });
    }
    return res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};