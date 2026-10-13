const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    allowNull: true, 
    defaultValue: () => Math.floor(1000000000 + Math.random() * 9000000000)
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^\+?[0-9\s\-\(\)]+$/,
        msg: "El formato del teléfono no es válido. Solo puede contener números, espacios, guiones y paréntesis."
      },
      len: {
        args: [7, 20],
        msg: "Formato no valido."
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    defaultValue: 'S'
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  hooks: {
    beforeValidate: (cliente) => {
      if (cliente.telefono) {
        const hasPlus = cliente.telefono.startsWith('+');
        const digitsOnly = cliente.telefono.replace(/\D/g, '');
        cliente.telefono = hasPlus ? `+${digitsOnly}` : digitsOnly;
      }
    },
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