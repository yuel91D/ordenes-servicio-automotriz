const clienteRepository = require('../repositories/clienteRepository');

class ClienteService {
  async listarClientes() {
    return await clienteRepository.obtenerTodos();
  }

  async obtenerCliente(id) {
    const cliente = await clienteRepository.obtenerPorId(id);
    if (!cliente) throw new Error('Cliente no encontrado');
    return cliente;
  }

  async crearCliente(datos) {
    return await clienteRepository.crear(datos);
  }

  async actualizarCliente(id, datos) {
    const cliente = await clienteRepository.actualizar(id, datos);
    if (!cliente) throw new Error('Cliente no encontrado para actualizar');
    return cliente;
  }

  async eliminarCliente(id) {
    const eliminado = await clienteRepository.eliminar(id);
    if (!eliminado) throw new Error('Cliente no encontrado para eliminar');
    return true;
  }
}

module.exports = new ClienteService();