const ordenServicioRepository = require('../repositories/ordenServicioRepository');

class OrdenServicioController {
  // 1. Obtener todas las órdenes
  async getAll(req, res) {
    try {
      const ordenes = await ordenServicioRepository.getAll();
      return res.status(200).json(ordenes);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al obtener las órdenes de servicio', 
        error: error.message 
      });
    }
  }

  // 2. Obtener una sola orden por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orden = await ordenServicioRepository.getById(id);
      
      if (!orden) {
        return res.status(404).json({ message: 'Orden de servicio no encontrada' });
      }
      
      return res.status(200).json(orden);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al obtener la orden de servicio', 
        error: error.message 
      });
    }
  }

  // 3. Crear una nueva orden
  async create(req, res) {
    try {
      const nuevaOrden = await ordenServicioRepository.create(req.body);
      return res.status(201).json({
        message: 'Orden de servicio creada con éxito',
        data: nuevaOrden
      });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al crear la orden de servicio', 
        error: error.message 
      });
    }
  }

  // 4. Actualizar una orden
  async update(req, res) {
    try {
      const { id } = req.params;
      const ordenActualizada = await ordenServicioRepository.update(id, req.body);
      
      if (!ordenActualizada) {
        return res.status(404).json({ message: 'Orden de servicio no encontrada para actualizar' });
      }
      
      return res.status(200).json({
        message: 'Orden de servicio actualizada con éxito',
        data: ordenActualizada
      });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al actualizar la orden de servicio', 
        error: error.message 
      });
    }
  }

  // 5. Eliminar una orden
  async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await ordenServicioRepository.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ message: 'Orden de servicio no encontrada' });
      }
      
      return res.status(200).json({ message: 'Orden de servicio eliminada correctamente' });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al eliminar la orden de servicio', 
        error: error.message 
      });
    }
  }
}

// Exportamos la instancia para usarla en las rutas
module.exports = new OrdenServicioController();