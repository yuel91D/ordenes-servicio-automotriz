const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Usuario = require('../models/usuario');
const Rol = require('../models/rol');

// GET: Listar todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre_completo', 'email', 'rol_id'],
      include: [{ model: Rol, as: 'rolDelUsuario' }]
    });
    
    res.status(200).json({
      success: true,
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    next(error);
  }
});

// POST: Crear un nuevo usuario
router.post('/', async (req, res, next) => {
  try {
    const { nombre_completo, email, password, rol_id } = req.body;
    
    // Validar si ya existe un usuario con el mismo email o el mismo nombre completo
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [
          { email },
          { nombre_completo }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe (el correo o el nombre completo ya se encuentran registrados).'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre_completo,
      email,
      password: hashedPassword,
      rol_id
    });

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
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors ? error.errors.map(e => e.message).join(', ') : 'Error de validación.'
      });
    }
    next(error);
  }
});

// PUT: Actualizar un usuario por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, password, rol_id } = req.body;

    // 1. Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no existe.'
      });
    }

    // 2. Validar si el nuevo correo o nombre completo ya pertenecen a OTRO usuario
    if (email || nombre_completo) {
      const condiciones = [];
      if (email) condiciones.push({ email });
      if (nombre_completo) condiciones.push({ nombre_completo });

      const usuarioDuplicado = await Usuario.findOne({
        where: {
          [Op.or]: condiciones,
          id: { [Op.ne]: id } // Excluir al propio usuario que se está editando
        }
      });

      if (usuarioDuplicado) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico o el nombre completo ya pertenecen a otro usuario.'
        });
      }
    }

    // 3. Preparar los datos a actualizar
    let datosActualizados = {
      nombre_completo: nombre_completo !== undefined ? nombre_completo : usuario.nombre_completo,
      email: email !== undefined ? email : usuario.email,
      rol_id: rol_id !== undefined ? rol_id : usuario.rol_id
    };

    // 4. Si se proporciona una contraseña, hashearla de nuevo
    if (password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(password, salt);
    }

    // 5. Guardar cambios en la base de datos
    await usuario.update(datosActualizados);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol_id: usuario.rol_id
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors ? error.errors.map(e => e.message).join(', ') : 'Error de validación.'
      });
    }
    next(error);
  }
});

// DELETE: Eliminar un usuario por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Verificar si el usuario existe antes de eliminar
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no existe.'
      });
    }

    // 2. Ejecutar la eliminación
    await usuario.destroy();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;