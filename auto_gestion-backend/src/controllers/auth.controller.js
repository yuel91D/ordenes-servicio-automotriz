const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol, as: 'rol' }]
    });

    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
    }

    const payload = {
      id: usuario.usuario_id || usuario.id,
      email: usuario.email,
      rolId: usuario.rol_id,
      rolNombre: usuario.rol ? usuario.rol.nombre : null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto_super_seguro_2026', {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    return res.json({
      ok: true,
      mensaje: 'Autenticación exitosa',
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
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

module.exports = { login };