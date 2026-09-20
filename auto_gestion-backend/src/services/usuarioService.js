const { Usuario, Rol } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const listarUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ['id', 'nombre_completo', 'email', 'rol_id'],
    include: [{ model: Rol, as: 'rolDelUsuario' }]
  });
};

const crearUsuario = async (data) => {
  const { nombre_completo, email, password, rol_id } = data;
  
  const usuarioExistente = await Usuario.findOne({
    where: { [Op.or]: [{ email }, { nombre_completo }] }
  });

  if (usuarioExistente) {
    const error = new Error('El usuario ya existe (el correo o el nombre completo ya se encuentran registrados).');
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await Usuario.create({
    nombre_completo,
    email,
    password: hashedPassword,
    rol_id
  });
};

const actualizarUsuario = async (id, data) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;

  const { email, nombre_completo, password, rol_id } = data;

  if (email || nombre_completo) {
    const condiciones = [];
    if (email) condiciones.push({ email });
    if (nombre_completo) condiciones.push({ nombre_completo });

    const usuarioDuplicado = await Usuario.findOne({
      where: { [Op.or]: condiciones, id: { [Op.ne]: id } }
    });

    if (usuarioDuplicado) {
      const error = new Error('El correo electrónico o el nombre completo ya pertenecen a otro usuario.');
      error.status = 400;
      throw error;
    }
  }

  let datosActualizados = {
    nombre_completo: nombre_completo !== undefined ? nombre_completo : usuario.nombre_completo,
    email: email !== undefined ? email : usuario.email,
    rol_id: rol_id !== undefined ? rol_id : usuario.rol_id
  };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    datosActualizados.password = await bcrypt.hash(password, salt);
  }

  return await usuario.update(datosActualizados);
};

const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;
  await usuario.destroy();
  return true;
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};