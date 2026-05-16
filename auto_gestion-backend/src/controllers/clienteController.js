const clienteRepository = require('../repositories/clienteRepository');

class ClienteController {
  async getAll(req, res) {
    try {
      const clientes = await clienteRepository.getAll();
      return res.status(200).json(clientes);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const cliente = await clienteRepository.getById(id);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json(cliente);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const nuevoCliente = await clienteRepository.create(req.body);
      return res.status(201).json({ message: 'Cliente creado con éxito', data: nuevoCliente });
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const clienteActualizado = await clienteRepository.update(id, req.body);
      if (!clienteActualizado) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json({ message: 'Cliente actualizado con éxito', data: clienteActualizado });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await clienteRepository.delete(id);
      if (!eliminado) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
    }
  }
}

module.exports = new ClienteController();