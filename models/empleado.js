const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  empleado_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  cedula: { type: DataTypes.STRING, unique: true, allowNull: false },
  cargo: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'empleados',
  timestamps: true,
  underscored: true
});

Empleado.associate = (models) => {
  // Protección contra referencia circular
  if (models.Usuario) {
    Empleado.hasOne(models.Usuario, { as: 'usuario', foreignKey: 'empleado_id' });
  }
};

module.exports = Empleado;