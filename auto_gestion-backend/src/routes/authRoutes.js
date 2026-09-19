const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');        

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario e incluimos su rol
    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{ model: Rol, as: 'rolDelUsuario' }]
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // 2. Comparamos la contraseña encriptada
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // 3. Generamos el token con id y rolId para los middlewares de autorización
    const token = jwt.sign(
      { 
        id: usuario.usuario_id || usuario.id, 
        email: usuario.email, 
        rolId: usuario.rol_id,
        rolNombre: usuario.rolDelUsuario ? usuario.rolDelUsuario.nombre : null 
      }, 
      process.env.JWT_SECRET || 'secreto_super_seguro_2026', 
      { expiresIn: '8h' }
    );
    
    return res.json({ 
      success: true, 
      token,
      usuario: {
        id: usuario.usuario_id || usuario.id,
        nombre: usuario.nombre_completo,
        email: usuario.email,
        rolId: usuario.rol_id
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

module.exports = router;