/**
 * @fileoverview Configuración del pool de conexiones a PostgreSQL
 * @module db
 */

const { Pool } = require('pg');

/**
 * Pool de conexiones a la base de datos PostgreSQL
 * @type {Pool}
 * @description Configuración del pool de conexiones usando variables de entorno
 * o valores por defecto para desarrollo local
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'api_rest_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

/**
 * Evento que se dispara cuando se establece una conexión exitosa
 * @event Pool#connect
 */
pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL');
});

/**
 * Evento que se dispara cuando ocurre un error en la base de datos
 * @event Pool#error
 * @param {Error} err - Objeto de error de PostgreSQL
 */
pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos:', err);
  process.exit(-1);
});

module.exports = pool;

