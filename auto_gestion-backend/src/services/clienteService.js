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

  async crearCliente(data) {
    if (!data.nombre) {
      throw new Error('El nombre del cliente es obligatorio');
    }
    return await clienteRepository.crear(data);
  }

  async actualizarCliente(id, data) {
    const cliente = await clienteRepository.actualizar(id, data);
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