const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    allowNull: true,
    field: 'vehiculos_id',
    defaultValue: () => Math.floor(1000000000 + Math.random() * 9000000000)
  },
  propietario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipoVehiculo: {
    type: DataTypes.STRING,
    field: 'tipo_vehiculo'
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cliente_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'cliente_id'
  }
}, {
  tableName: 'vehiculos',
  timestamps: false,
  hooks: {
    beforeCreate: async (vehiculo, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);
        const [resultado] = await sequelize.query(
          `SELECT vehiculos_id FROM vehiculos WHERE vehiculos_id = ${nuevoId} LIMIT 1`,
          { transaction: options.transaction }
        );
        
        if (resultado.length === 0) {
          idExiste = false;
        }
      }

      vehiculo.id = nuevoId;
    }
  }
});

Vehiculo.associate = (models) => {
  if (models && models.Cliente) {
    Vehiculo.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'cliente_id' });
  }
  if (models && models.OrdenServicio) {
    Vehiculo.hasMany(models.OrdenServicio, { as: 'ordenesServicio', foreignKey: 'vehiculo_id' });
  }
};

module.exports = Vehiculo;