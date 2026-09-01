const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    field: 'rol_id'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,       // Sequelize activará la gestión automática
  createdAt: 'created_at',  // Mapea con tu columna en snake_case
  updated_at: 'updated_at'  // Mapea con tu columna en snake_case
});

Rol.associate = (models) => {
  // Aquí definiremos las relaciones más adelante (por ejemplo, con empleados o usuarios)
};

module.exports = Rol;