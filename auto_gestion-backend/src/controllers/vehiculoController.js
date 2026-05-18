const Vehiculo = require('../models/vehiculos');

const crearVehiculo = async (req, res) => {
  try {
    const { placa, tipoVehiculo, kilometraje, estado, propietario, cliente_id } = req.body;

    const nuevoVehiculo = await Vehiculo.create({
      placa,
      tipoVehiculo,
      kilometraje,
      estado,
      propietario,
      clienteId: cliente_id // Mapea al camelCase del modelo respetando tu base de datos
    });

    return res.status(201).json({ success: true, data: nuevoVehiculo });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: `La placa '${req.body.placa}' ya está registrada en el taller.`
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: `El cliente_id ${req.body.cliente_id} no existe en la base de datos.`
      });
    }

    console.error("❌ [Error Vehículo]:", error.message);
    return res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
};

// 🌟 CORREGIDO: Ahora recibe obligatoriamente (req, res) en orden nativo de Express
const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params; // 👈 Sacamos el id correctamente de req.params
    const { placa, tipoVehiculo, kilometraje, estado, propietario, cliente_id } = req.body;

    const datosActualizar = {
      placa,
      tipoVehiculo,
      kilometraje,
      estado,
      propietario,
      ...(cliente_id && { clienteId: cliente_id })
    };

    const [actualizado] = await Vehiculo.update(datosActualizar, { where: { id } });

    if (!actualizado) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado." });
    }

    const vehiculoEditado = await Vehiculo.findByPk(id);
    return res.status(200).json({ success: true, data: vehiculoEditado });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: "Esa placa ya le pertenece a otro auto." });
    }
    return res.status(500).json({ success: false, message: "Error al actualizar el vehículo." });
  }
};

const listarVehiculos = async (req, res) => {
  try {
    const lista = await Vehiculo.findAll();
    return res.status(200).json({ success: true, data: lista });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const obtenerVehiculo = async (req, res) => {
  try {
    const data = await Vehiculo.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "No encontrado" });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const eliminarVehiculo = async (req, res) => {
  try {
    const eliminado = await Vehiculo.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ success: false, message: "No encontrado" });
    return res.status(200).json({ success: true, message: "Vehículo eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  crear: crearVehiculo,
  actualizar: actualizarVehiculo,
  listar: listarVehiculos,
  obtener: obtenerVehiculo,
  eliminar: eliminarVehiculo
};