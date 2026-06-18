const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: {
    // 1. Ampliamos a BIGINT para soportar los 10 dígitos masivos
    type: DataTypes.BIGINT,
    primaryKey: true,
    // 2. Quitamos la secuencia automática
    autoIncrement: false,
    field: 'orden_servicio_id'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoOrden: {
    type: DataTypes.STRING,
    field: 'tipo_orden'
  },
  vehiculoId: {
    // 1. ¡Crucial! La FK también debe ser BIGINT para acoplarse con la otra tabla
    type: DataTypes.BIGINT,
    field: 'vehiculo_id'
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false,
  
  // 3. Añadimos el hook de generación aleatoria dispersa
  hooks: {
    beforeCreate: async (orden, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        // Genera un número aleatorio entero de 10 dígitos (entre 1000000000 y 9999999999)
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);

        // Validamos que no se repita en la tabla ordenes_servicio
        const duplicado = await OrdenServicio.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false; // ID libre, rompemos bucle
        }
      }

      // Asignamos el número generado al ID de la nueva orden
      orden.id = nuevoId;
    }
  }
});

OrdenServicio.associate = (models) => {
  OrdenServicio.belongsTo(models.Vehiculo, { as: 'vehiculo', foreignKey: 'vehiculo_id' });
  OrdenServicio.hasMany(models.ItemOrden, { as: 'items', foreignKey: 'orden_servicio_id' });
};

module.exports = OrdenServicio;