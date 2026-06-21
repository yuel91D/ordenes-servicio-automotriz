const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false, // Usamos tu lógica manual de generación
    field: 'vehiculos_id'
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Asegura integridad en la DB
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
  propietario: {
    type: DataTypes.STRING
  },
  clienteId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'cliente_id' // FK que enlaza con tu tabla clientes
  }
}, {
  tableName: 'vehiculos',
  timestamps: false, // Manténlo así si no usas createdAt/updatedAt en esta tabla
  hooks: {
    beforeCreate: async (vehiculo, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        // Genera el número aleatorio de 10 dígitos
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);

        // Verificamos que no colisione en la tabla vehiculos
        const duplicado = await Vehiculo.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false;
        }
      }
      vehiculo.id = nuevoId;
    }
  }
});

// Relaciones definidas para Sequelize
Vehiculo.associate = (models) => {
  Vehiculo.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'cliente_id' });
  Vehiculo.hasMany(models.OrdenServicio, { as: 'ordenes', foreignKey: 'vehiculo_id' });
};

module.exports = Vehiculo;