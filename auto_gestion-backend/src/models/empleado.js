const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_ingreso: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
  type: DataTypes.CHAR(1),
  allowNull: false,
  defaultValue: 'S'
}

}, {
  tableName: 'empleados',
  timestamps: false
});

Empleado.associate = (models) => {
  Empleado.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = Empleado;