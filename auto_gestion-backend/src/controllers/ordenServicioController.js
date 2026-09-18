const { OrdenServicio, ItemOrden, Vehiculo, Cliente, sequelize } = require('../models');

// 1. CREAR ORDEN EN CASCADA CON TRANSACCIÓN Y AUTOCREACIÓN
const crearOrdenServicio = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { 
      tipo_orden, tipo_pago, vehiculo_id, placa, marca, modelo, 
      anio, tipoVehiculo, kilometraje, estadoVehiculo, propietario, 
      telefono, email, items 
    } = req.body;

    let vehiculoFinalId = vehiculo_id;

    // Resolver Vehículo y Cliente si no existe el ID
    if (!vehiculoFinalId && placa) {
      let vehiculo = await Vehiculo.findOne({ where: { placa }, transaction: t });

      if (!vehiculo) {
        let cliente = null;
        if (email) {
          cliente = await Cliente.findOne({ where: { email }, transaction: t });
        }

        if (!cliente) {
          cliente = await Cliente.create({
            nombre: propietario || 'Cliente sin nombre',
            telefono: telefono || 'No registrado',
            email: email || 'no_registrado@taller.com'
          }, { transaction: t });
        }

        vehiculo = await Vehiculo.create({
          placa,
          marca: marca || 'Genérica',
          modelo: modelo || 'Genérico',
          anio: anio || new Date().getFullYear(),
          tipoVehiculo: tipoVehiculo || 'Automóvil',
          kilometraje: kilometraje || 0,
          estado: estadoVehiculo || 'activo',
          propietario: cliente.nombre,
          cliente_id: cliente.id
        }, { transaction: t });
      }

      vehiculoFinalId = vehiculo.id;
    }

    if (!vehiculoFinalId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un 'vehiculo_id' válido o los datos de la 'placa'."
      });
    }

    // Crear la Orden
    const nuevaOrden = await OrdenServicio.create({
      tipo_orden,
      tipo_pago: tipo_pago || 'Pendiente',
      estado: 'Recibido',
      fecha_ingreso: new Date(),
      vehiculo_id: vehiculoFinalId
    }, { transaction: t });

    // Inserción en cascada de los Ítems
    if (items && Array.isArray(items) && items.length > 0) {
      const itemsFormateados = items.map(item => ({
        ...item,
        orden_servicio_id: nuevaOrden.id
      }));
      await ItemOrden.bulkCreate(itemsFormateados, { transaction: t });
    }

    // Actualizar vehículo a 'en taller'
    await Vehiculo.update(
      { estado: 'en taller' }, 
      { where: { id: vehiculoFinalId }, transaction: t }
    );

    await t.commit();

    const ordenCompleta = await OrdenServicio.findByPk(nuevaOrden.id, {
      include: [
        { model: Vehiculo, as: 'vehiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: ItemOrden, as: 'items' }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Orden e ítems creados con éxito, y vehículo ingresado al taller.",
      data: ordenCompleta
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error al crear orden:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LISTAR TODAS LAS ÓRDENES CON RELACIONES
const listarOrdenesServicio = async (req, res) => {
  try {
    const ordenes = await OrdenServicio.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: ItemOrden, as: 'items' }
      ]
    });
    return res.status(200).json({ success: true, data: ordenes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. OBTENER ÓRDEN POR ID
const obtenerOrdenServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await OrdenServicio.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: ItemOrden, as: 'items' }
      ]
    });

    if (!orden) return res.status(404).json({ success: false, message: "Orden de servicio no encontrada." });
    return res.status(200).json({ success: true, data: orden });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. ACTUALIZAR ÓRDEN CON VALIDACIÓN DE PAGO Y CAMBIO DE ESTADO
const actualizarOrdenServicio = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { tipo_orden, estado, tipo_pago, vehiculo_id } = req.body;

    const ordenActual = await OrdenServicio.findByPk(id, { transaction: t });
    if (!ordenActual) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Orden no encontrada." });
    }

    const nuevoEstado = estado || ordenActual.estado;
    const nuevoTipoPago = tipo_pago || ordenActual.tipo_pago;

    // Validación de entrega sin pago
    if (nuevoEstado === 'Entregado' && nuevoTipoPago === 'Pendiente') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "No se puede entregar la orden de servicio si el tipo de pago se encuentra 'Pendiente'."
      });
    }

    const datosActualizar = {
      ...(tipo_orden && { tipo_orden }),
      ...(estado && { estado }),
      ...(tipo_pago && { tipo_pago }),
      ...(vehiculo_id && { vehiculo_id })
    };

    if ((estado === 'Entregado' || estado === 'Cancelado') && !ordenActual.fecha_salida) {
      datosActualizar.fecha_salida = new Date();
    }

    await OrdenServicio.update(datosActualizar, { where: { id }, transaction: t });

    // Sincronizar estado del vehículo
    if (estado) {
      if (estado === 'Entregado' || estado === 'Cancelado') {
        await Vehiculo.update({ estado: 'activo' }, { where: { id: ordenActual.vehiculo_id }, transaction: t });
      } else if (['Recibido', 'En proceso', 'Finalizado'].includes(estado)) {
        await Vehiculo.update({ estado: 'en taller' }, { where: { id: ordenActual.vehiculo_id }, transaction: t });
      }
    }

    await t.commit();

    const ordenEditada = await OrdenServicio.findByPk(id, {
      include: [{ model: Vehiculo, as: 'vehiculo' }, { model: ItemOrden, as: 'items' }]
    });

    return res.status(200).json({ success: true, message: "Orden actualizada correctamente.", data: ordenEditada });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. BLOQUEAR ELIMINACIÓN DE ÓRDENES
const bloquearEliminacion = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Acción prohibida: Las órdenes de servicio no se pueden eliminar por normativas de auditoría. Utilice el cambio de estado a 'Cancelado'."
  });
};

module.exports = {
  crear: crearOrdenServicio,
  listar: listarOrdenesServicio,
  obtener: obtenerOrdenServicio,
  actualizar: actualizarOrdenServicio,
  bloquearEliminacion
};