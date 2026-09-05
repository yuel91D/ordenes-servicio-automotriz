const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    field: 'orden_servicio_id'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipo_orden: {
    type: DataTypes.STRING,
    field: 'tipo_orden'
  },
  vehiculo_id: {
    type: DataTypes.BIGINT,
    field: 'vehiculo_id'
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false,
  hooks: {
    beforeCreate: async (orden, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);
        const duplicado = await OrdenServicio.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false;
        }
      }

      orden.id = nuevoId;
    }
  }
});

OrdenServicio.associate = (models) => {
  if (models && models.ItemOrden) {
    OrdenServicio.hasMany(models.ItemOrden, { as: 'items', foreignKey: 'orden_servicio_id' });
  }
};

module.exports = OrdenServicio;