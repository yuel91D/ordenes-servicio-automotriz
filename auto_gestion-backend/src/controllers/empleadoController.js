const empleadoService = require('../services/empleadoService');

const listarEmpleados = async (req, res, next) => {
  try {
    const { incluirInactivos } = req.query;
    const empleados = await empleadoService.listarEmpleados(incluirInactivos);
    return res.status(200).json({ success: true, total: empleados.length, empleados });
  } catch (error) {
    next(error);
  }
};

const crearEmpleado = async (req, res, next) => {
  try {
    const nuevoEmpleado = await empleadoService.crearEmpleado(req.body);
    return res.status(201).json({ success: true, message: 'Empleado creado exitosamente', empleado: nuevoEmpleado });
  } catch (error) {
    next(error);
  }
};

const actualizarEmpleado = async (req, res, next) => {
  try {
    const actualizado = await empleadoService.actualizarEmpleado(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ success: false, message: 'Empleado no existe.' });
    return res.status(200).json({ success: true, message: 'Empleado actualizado exitosamente', empleado: actualizado });
  } catch (error) {
    next(error);
  }
};

const eliminarEmpleado = async (req, res, next) => {
  try {
    const eliminado = await empleadoService.eliminarEmpleado(req.params.id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Empleado no existe.' });
    return res.status(200).json({ success: true, message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};