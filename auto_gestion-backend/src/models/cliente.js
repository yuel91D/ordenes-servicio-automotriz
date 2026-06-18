const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    // 1. Cambiamos a BIGINT para soportar los 10 dígitos masivos
    type: DataTypes.BIGINT, 
    primaryKey: true,
    // 2. Quitamos el autoIncrement ya que nosotros calcularemos el ID
    autoIncrement: false 
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
  
  // 3. Agregamos los Hooks para interceptar la creación
  hooks: {
    beforeCreate: async (cliente, options) => {
      let idExiste = true;
      let nuevoId;

      // Un bucle "while" por seguridad extrema. Si el número al azar ya existe, genera otro.
      while (idExiste) {
        // Genera un número aleatorio entero de 10 dígitos entre 1000000000 y 9999999999
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);

        // Verificamos en la tabla si por alguna remota casualidad ya existe ese ID
        const duplicado = await Cliente.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false; // Rompe el bucle si el ID está libre
        }
      }

      // Le asignamos el número aleatorio de 10 dígitos al ID del nuevo cliente
      cliente.id = nuevoId;
    }
  }
});

// 🌟 Función estática para asociar de forma segura sin romper Node
Cliente.associate = (models) => {
  Cliente.hasMany(models.Vehiculo, { as: 'vehiculos', foreignKey: 'cliente_id' }); 
  // Nota: Asegúrate de que apunte a 'cliente_id' tal como quedó en la BD física
};

module.exports = Cliente;