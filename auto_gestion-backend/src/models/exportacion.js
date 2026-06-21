// models/exportacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exportacion = sequelize.define('Exportacion', {
id: {
  type: DataTypes.STRING(10),
  primaryKey: true,
  allowNull: false
},
  usuarioId: {
    type: DataTypes.BIGINT,
    field: 'usuario_id',
    allowNull: true
  },
  tipoFormato: {
    type: DataTypes.ENUM('csv', 'xlsx', 'pdf', 'html'),
    field: 'tipo_formato',
    allowNull: false
  },
  filtrosAplicados: {
    type: DataTypes.JSON,
    field: 'filtros_aplicados',
    allowNull: false
  },
  nombreArchivo: {
    type: DataTypes.STRING,
    field: 'nombre_archivo',
    allowNull: false
  },
  rutaArchivo: {
    type: DataTypes.STRING,
    field: 'ruta_archivo',
    allowNull: true
  },
  fechaGeneracion: {
    type: DataTypes.DATE,
    field: 'fecha_generacion',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'exportaciones',
  timestamps: false
});

module.exports = Exportacion;