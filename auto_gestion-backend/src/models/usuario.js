const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rol = require('./Rol');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'usuario_id'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    field: 'rol_id'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updated_at: 'updated_at'
});

// Definimos únicamente la pertenencia del usuario hacia su rol, evitando duplicar el hasMany si ya existe en Rol.js
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rolDelUsuario' });

module.exports = Usuario;