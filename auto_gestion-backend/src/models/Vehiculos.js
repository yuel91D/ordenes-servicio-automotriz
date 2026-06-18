const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    // 1. Pasamos a BIGINT para soportar los 10 dígitos aleatorios
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false, // 2. Quitamos la secuencia automática
    field: 'vehiculos_id'
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoVehiculo: {
    type: DataTypes.STRING,
    field: 'tipo_vehiculo'
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  propietario: {
    type: DataTypes.STRING
  },
  clienteId: {
    // 1. ¡Importante! La FK también muta a BIGINT para encajar con Clientes
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'cliente_id'
  }
}, {
  tableName: 'vehiculos',
  timestamps: false,

  // 3. Hook para interceptar la creación del vehículo
  hooks: {
    beforeCreate: async (vehiculo, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        // Genera el número aleatorio de 10 dígitos
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);

        // Verificamos que no colisione en la tabla vehiculos
        const duplicado = await Vehiculo.findByPk(nuevoId);
        if (!duplicado) {
          idExiste = false; // ID único encontrado, salimos del bucle
        }
      }

      // Seteamos el ID aleatorio antes de guardarlo en MySQL
      vehiculo.id = nuevoId;
    }
  }
});

Vehiculo.associate = (models) => {
  Vehiculo.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'cliente_id' });
  Vehiculo.hasMany(models.OrdenServicio, { as: 'ordenes', foreignKey: 'vehiculo_id' });
};

module.exports = Vehiculo;