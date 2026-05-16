const mysql = require('mysql2');
require('dotenv').config();

// Creamos el pool de conexiones incluyendo el puerto dinámico
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // <-- Añadimos esta línea para mayor precisión
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

console.log('📦 Pool de conexiones a MySQL configurado con éxito.');

module.exports = promisePool;