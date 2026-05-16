const itemOrdenRepository = require('../repositories/itemOrdenRepository');

class ItemOrdenController {
  async getAll(req, res) {
    try {
      const items = await itemOrdenRepository.getAll();
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener los ítems', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await itemOrdenRepository.getById(id);
      if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });
      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el ítem', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const nuevoItem = await itemOrdenRepository.create(req.body);
      return res.status(201).json({ message: 'Ítem agregado a la orden con éxito', data: nuevoItem });
    } catch (error) {
      return res.status(500).json({ message: 'Error al agregar el ítem', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const itemActualizado = await itemOrdenRepository.update(id, req.body);
      if (!itemActualizado) return res.status(404).json({ message: 'Ítem no encontrado' });
      return res.status(200).json({ message: 'Ítem actualizado con éxito', data: itemActualizado });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el ítem', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await itemOrdenRepository.delete(id);
      if (!eliminado) return res.status(404).json({ message: 'Ítem no encontrado' });
      return res.status(200).json({ message: 'Ítem eliminado de la orden correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el ítem', error: error.message });
    }
  }
}

module.exports = new ItemOrdenController();