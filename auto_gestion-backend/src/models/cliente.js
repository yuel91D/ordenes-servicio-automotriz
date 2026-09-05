const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    allowNull: true, // Permite que inicie nulo para que el hook lo llene
    defaultValue: () => Math.floor(1000000000 + Math.random() * 9000000000) // Generador por defecto integrado
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  hooks: {
    beforeCreate: async (cliente, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);
        const duplicado = await Cliente.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false;
        }
      }

      cliente.id = nuevoId;
    }
  }
});

module.exports = Cliente;