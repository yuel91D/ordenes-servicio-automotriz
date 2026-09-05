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
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at', 
  updatedAt: 'updatedAt' // O 'updated_at' dependiendo de cómo esté exactamente en MySQL Workbench
});

Rol.associate = (models) => {
  // Aquí definiremos las relaciones más adelante (por ejemplo, con empleados o usuarios)
};

module.exports = Rol;