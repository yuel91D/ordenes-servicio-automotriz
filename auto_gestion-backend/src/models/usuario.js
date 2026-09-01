const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rol = require('./Rol'); // Importamos el modelo Rol para la relación

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'usuario_id' // Opcional, ajusta si tu columna en BD se llama diferente
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
    defaultValue: 1, // Asegúrate de que exista un rol con este ID o ajústalo según tu lógica
    field: 'rol_id'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Definición de la asociación
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });

module.exports = Usuario;