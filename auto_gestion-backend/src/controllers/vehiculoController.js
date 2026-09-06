const Vehiculo = require('../models/Vehiculos');
const Cliente = require('../models/cliente');

const crearVehiculo = async (req, res) => {
  try {
    const { 
      vehiculos_id,
      placa, 
      tipoVehiculo, 
      kilometraje, 
      estado, 
      propietario, 
      telefono, 
      email,
      marca, 
      modelo, 
      anio     
    } = req.body;

    // 1. Buscar si el cliente ya existe en la base de datos por su email
    let cliente = null;
    if (email) {
      cliente = await Cliente.findOne({ where: { email } });
    }

    let clienteCreado = false;

    // 2. Si no existe, dejamos que la tabla clientes lo cree y le asigne su ID nativo
    if (!cliente) {
      cliente = await Cliente.create({
        nombre: propietario || 'Cliente sin nombre',
        telefono: telefono || 'No registrado',
        email: email || 'no_registrado@taller.com'
      });
      clienteCreado = true;
    }

    // 3. Crear el vehículo utilizando el ID oficial y real que nos devolvió la tabla clientes
    const nuevoVehiculo = await Vehiculo.create({
      id: vehiculos_id,
      propietario: cliente.nombre,
      placa,
      marca,
      modelo,
      anio,
      tipoVehiculo,
      kilometraje,
      estado,
      cliente_id: cliente.id // <- Se vincula con el ID real de la tabla clientes
    });

    return res.status(201).json({ 
      success: true, 
      message: clienteCreado ? "Cliente creado en la tabla y vehículo registrado con éxito." : "Vehículo registrado con éxito al cliente existente.",
      data: nuevoVehiculo 
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: `La placa '${req.body.placa}' ya está registrada en el taller.`
      });
    }

    console.error("❌ [Error Vehículo]:", error.message);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", error: error.message });
  }
};

const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, tipoVehiculo, kilometraje, estado, propietario, cliente_id, marca, modelo, anio } = req.body;

    const datosActualizar = {
      placa,
      tipoVehiculo,
      kilometraje,
      estado,
      propietario,
      marca,
      modelo,
      anio,
      ...(cliente_id && { cliente_id })
    };

    const [actualizado] = await Vehiculo.update(datosActualizar, { where: { vehiculos_id: id } });

    if (!actualizado) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado." });
    }

    const vehiculoEditado = await Vehiculo.findByPk(id);
    return res.status(200).json({ success: true, data: vehiculoEditado });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: "Esa placa ya le pertenece a otro auto." });
    }
    return res.status(500).json({ success: false, message: error.message });
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
    const eliminado = await Vehiculo.destroy({ where: { vehiculos_id: req.params.id } });
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