const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); 
const Rol = require('../models/Rol');         

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario incluyendo su rol asociado con el alias único
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

    // 3. Generamos el token incluyendo el nombre del rol obtenido de la relación
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rolDelUsuario ? usuario.rolDelUsuario.nombre : null 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );
    
    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

module.exports = router;