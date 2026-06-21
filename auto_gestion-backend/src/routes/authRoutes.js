const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario'); // Importamos tu modelo real

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario real
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // 2. Comparamos la contraseña encriptada
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // 3. Generamos el token incluyendo el ROL
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );
    
    return res.json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

module.exports = router;