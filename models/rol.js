const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Rol', {
  rol_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_rol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false,
  underscored: true
});

Rol.associate = (models) => {
  Rol.hasMany(models.Usuario, { as: 'usuarios', foreignKey: 'rol_id' });
};

module.exports = Rol;