const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'vendedor', 'cliente'),
    defaultValue: 'cliente',
    allowNull: false
  }
}, {
  tableName: 'usuarios', // Nombre explícito de la tabla
  timestamps: true       // Crea createdAt y updatedAt automáticamente
});

module.exports = Usuario;