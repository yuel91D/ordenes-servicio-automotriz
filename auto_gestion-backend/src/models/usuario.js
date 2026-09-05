const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rol = require('./rol');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    allowNull: true,
    field: 'usuario_id',
    defaultValue: () => Math.floor(1000000000 + Math.random() * 9000000000)
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_completo',
    unique: {
      msg: "El nombre completo ya se encuentra registrado."
    },
    validate: {
      notNull: { msg: "El campo nombre completo es obligatorio." },
      notEmpty: { msg: "El nombre completo no puede estar vacío." }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
      msg: "El correo electrónico ya se encuentra registrado."
    },
    validate: {
      notNull: { msg: "El campo email es obligatorio." },
      isEmail: { msg: "Debe proporcionar un formato de correo electrónico válido." }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: "La contraseña es obligatoria." },
      notEmpty: { msg: "La contraseña no puede estar vacía." }
    }
  },
  rol_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    field: 'rol_id',
    references: {
      model: 'roles',
      key: 'rol_id'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);
        const duplicado = await Usuario.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false;
        }
      }

      usuario.id = nuevoId;
    }
  }
});

// Relación con el modelo Rol
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rolDelUsuario' });

module.exports = Usuario;