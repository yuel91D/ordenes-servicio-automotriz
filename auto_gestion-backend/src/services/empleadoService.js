const bcrypt = require('bcryptjs');
const { Empleado, Usuario, sequelize } = require('../models');

function generarId10Digitos() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

const obtenerEmpleados = async (incluirInactivos = false) => {
  // Si incluirInactivos es 'true' o true, no filtramos por estado; de lo contrario, solo 'S'
  const traerTodos = incluirInactivos === 'true' || incluirInactivos === true;
  const whereClause = traerTodos ? {} : { estado: 'S' };

  const empleados = await Empleado.findAll({
    where: whereClause,
    include: [{ model: Usuario, as: 'usuario' }]
  });

  return empleados;
};

const obtenerEmpleadoPorId = async (id) => {
  return await Empleado.findByPk(id, {
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['id', 'email', 'rol_id', 'estado']
    }]
  });
};

const crearEmpleadoConUsuario = async (data) => {
  const t = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(data.password || 'Temp1234!', 10);
    
    const nuevoUsuario = await Usuario.create({
      nombre_completo: data.nombre,
      email: data.email || `${data.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@shield.com`,
      password: hashedPassword,
      rol_id: data.rol_id !== undefined ? data.rol_id : 2,
      estado: 'S'
    }, { transaction: t });

    const userId = nuevoUsuario.id;

    const nuevoEmpleado = await Empleado.create({
      id: generarId10Digitos(),
      usuario_id: userId,
      nombre: data.nombre,
      cedula: data.cedula,
      fecha_ingreso: data.fecha_ingreso,
      estado: 'S'
    }, { transaction: t });

    await t.commit();
    return { empleado: nuevoEmpleado, usuario: nuevoUsuario };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const actualizarEmpleado = async (id, data) => {
  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    throw new Error('Empleado no encontrado');
  }
  return await empleado.update(data);
};

const eliminarEmpleado = async (id) => {
  const t = await sequelize.transaction();
  try {
    const empleado = await Empleado.findByPk(id, { transaction: t });
    if (!empleado) {
      throw new Error('Empleado no encontrado');
    }
    
    // Baja lógica del empleado ('N')
    await empleado.update({ estado: 'N' }, { transaction: t });
    
    // Baja lógica del usuario asociado ('N')
    if (empleado.usuario_id) {
      await Usuario.update({ estado: 'N' }, { where: { id: empleado.usuario_id }, transaction: t });
    }
    
    await t.commit();
    return { message: 'Empleado e ingreso de usuario inactivados lógicamente (estado: N)' };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = {
  obtenerEmpleados,
  listarEmpleados: obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado: crearEmpleadoConUsuario,
  actualizarEmpleado,
  eliminarEmpleado
};