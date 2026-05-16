const vehiculoRepository = require('../repositories/vehiculoRepository');

class VehiculoController {
  async getAll(req, res) {
    try {
      const vehiculos = await vehiculoRepository.getAll();
      return res.status(200).json(vehiculos);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener los vehículos', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const vehiculo = await vehiculoRepository.getById(id);
      if (!vehiculo) return res.status(404).json({ message: 'Vehículo no encontrado' });
      return res.status(200).json(vehiculo);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el vehículo', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const nuevoVehiculo = await vehiculoRepository.create(req.body);
      return res.status(201).json({ message: 'Vehículo registrado con éxito', data: nuevoVehiculo });
    } catch (error) {
      return res.status(500).json({ message: 'Error al registrar el vehículo', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const vehiculoActualizado = await vehiculoRepository.update(id, req.body);
      if (!vehiculoActualizado) return res.status(404).json({ message: 'Vehículo no encontrado' });
      return res.status(200).json({ message: 'Vehículo actualizado con éxito', data: vehiculoActualizado });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el vehículo', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await vehiculoRepository.delete(id);
      if (!eliminado) return res.status(404).json({ message: 'Vehículo no encontrado' });
      return res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
  }
}

module.exports = new VehiculoController();