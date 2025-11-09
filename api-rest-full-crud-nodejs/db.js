// Pool conexiones PostgreSQL
const { Pool } = require('pg');

// Configuración pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'api_rest_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Evento conexión
pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL');
});

// Evento error
pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos:', err);
  process.exit(-1);
});

module.exports = pool;

