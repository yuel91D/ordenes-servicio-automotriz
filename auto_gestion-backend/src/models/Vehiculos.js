const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./cliente'); // Importamos a su dueño

const Vehiculos = sequelize.define('Vehiculos', {
  vehiculoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'vehiculos_id' // Nombre exacto en tu MySQL
  },
  placa: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  tipoVehiculo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'tipo_vehiculo' // Mapea tipo_vehiculo de la base de datos
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Quedó como NULL en la migración del ALTER TABLE
    field: 'cliente_id', // Columna que movimos al medio
    references: {
      model: Cliente,
      key: 'id'
    }
  }
// ... Definición de columnas arriba ...
}, {
  tableName: 'vehiculos',
  timestamps: false
});

// ❌ Asegúrate de que aquí abajo NO haya líneas como Cliente.hasMany o Vehiculos.hasMany activa.

module.exports = Vehiculos;