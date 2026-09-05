// 🌟 IMPORTACIÓN DIRECTA: Sequelize mapea el modelo como 'Cliente' con mayúscula
const { Cliente } = require('../models');
const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * 🎯 Crear un nuevo cliente
 * POST /clientes
 */
const crearCliente = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;

    // Validación básica de campos obligatorios a nivel controlador
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El campo nombre es obligatorio."
      });
    }

    // Insertamos directo en la base de datos MySQL
    const nuevoCliente = await Cliente.create({
      nombre,
      telefono,
      email
    });

    return res.status(201).json({
      success: true,
      data: nuevoCliente
    });

  } catch (error) {
    console.error("❌ [Error Crear Cliente]:", error.message);

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        success: false,
        message: "El cliente ya existe (correo o datos duplicados)."
      });
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear el cliente."
    });
  }
};

/**
 * 📋 Listar todos los clientes
 * GET /clientes
 */
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    
    return res.status(200).json({
      success: true,
      count: clientes.length,
      data: clientes
    });
  } catch (error) {
    console.error("❌ [Error Listar Clientes]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al listar los clientes."
    });
  }
};

/**
 * 🔍 Obtener un cliente específico por ID
 * GET /clientes/:id
 */
const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: `Cliente con ID ${id} no encontrado.`
      });
    }

    return res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error("❌ [Error Obtener Cliente]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener el cliente."
    });
  }
};

/**
 * 🔄 Actualizar datos de un cliente
 * PUT /clientes/:id
 */
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: `Cliente con ID ${id} no encontrado.`
      });
    }

    // Actualizamos los campos en memoria y persistimos en MySQL
    await cliente.update({
      nombre: nombre || cliente.nombre,
      telefono: telefono !== undefined ? telefono : cliente.telefono,
      email: email !== undefined ? email : cliente.email
    });

    return res.status(200).json({
      success: true,
      message: "Cliente actualizado con éxito.",
      data: cliente
    });
  } catch (error) {
    console.error("❌ [Error Actualizar Cliente]:", error.message);

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        success: false,
        message: "Ya existe otro cliente con esos datos (correo duplicado)."
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar el cliente."
    });
  }
};

/**
 * 🗑️ Eliminar un cliente por ID
 * DELETE /clientes/:id
 */
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: `Cliente con ID ${id} no encontrado.`
      });
    }

    // Borrado físico de la fila en la BD
    await cliente.destroy();

    return res.status(200).json({
      success: true,
      message: `Cliente con ID ${id} eliminado correctamente.`
    });
  } catch (error) {
    console.error("❌ [Error Eliminar Cliente]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar el cliente."
    });
  }
};

// 🚀 Exportación limpia mapeada uno a uno con tus rutas
module.exports = {
  crear: crearCliente,
  listar: listarClientes,
  obtener: obtenerCliente,
  actualizar: actualizarCliente,
  eliminar: eliminarCliente
};