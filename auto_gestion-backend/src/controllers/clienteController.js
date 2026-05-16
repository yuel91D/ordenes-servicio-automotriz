const clienteService = require('../services/clienteService');

class ClienteController {
  async listar(req, res) {
    try {
      const clientes = await clienteService.listarClientes();
      res.json({ success: true, data: clientes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async obtener(req, res) {
    try {
      const cliente = await clienteService.obtenerCliente(req.params.id);
      res.json({ success: true, data: cliente });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async crear(req, res) {
    try {
      const cliente = await clienteService.crearCliente(req.body);
      res.status(201).json({ success: true, data: cliente });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const cliente = await clienteService.actualizarCliente(req.params.id, req.body);
      res.json({ success: true, data: cliente });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await clienteService.eliminarCliente(req.params.id);
      res.json({ success: true, message: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ClienteController();