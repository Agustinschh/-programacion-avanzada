/**
 * @fileoverview Servidor Express con API REST para gestión de usuarios
 * @module server
 */

const express = require('express');
const pool = require('./db');

/**
 * Aplicación Express
 * @type {express.Application}
 */
const app = express();

/**
 * Puerto del servidor
 * @type {number}
 * @default 3000
 */
const PORT = process.env.PORT || 3000;

/**
 * Middleware para parsear el cuerpo de las peticiones en formato JSON
 */
app.use(express.json());

/**
 * Obtiene todos los usuarios
 * @route GET /users
 * @returns {Object[]} Array de usuarios
 * @returns {number} returns[].id - ID del usuario
 * @returns {string} returns[].name - Nombre del usuario
 * @returns {string} returns[].email - Email del usuario
 * @returns {string} returns[].created_at - Fecha de creación
 */
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

/**
 * Obtiene un usuario por su ID
 * @route GET /users/:id
 * @param {number} id - ID del usuario
 * @returns {Object} Usuario encontrado
 * @returns {number} returns.id - ID del usuario
 * @returns {string} returns.name - Nombre del usuario
 * @returns {string} returns.email - Email del usuario
 * @returns {string} returns.created_at - Fecha de creación
 */
app.get('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

/**
 * Crea un nuevo usuario
 * @route POST /users
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.name - Nombre del usuario (requerido)
 * @param {string} req.body.email - Email del usuario (requerido, único)
 * @returns {Object} Usuario creado
 * @returns {number} returns.id - ID del usuario generado
 * @returns {string} returns.name - Nombre del usuario
 * @returns {string} returns.email - Email del usuario
 * @returns {string} returns.created_at - Fecha de creación
 */
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body || {};

        if (!name || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Violación de constraint único (email duplicado)
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

/**
 * Actualiza un usuario existente
 * @route PUT /users/:id
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} [req.body.name] - Nuevo nombre del usuario (opcional)
 * @param {string} [req.body.email] - Nuevo email del usuario (opcional, único)
 * @returns {Object} Usuario actualizado
 * @returns {number} returns.id - ID del usuario
 * @returns {string} returns.name - Nombre actualizado
 * @returns {string} returns.email - Email actualizado
 * @returns {string} returns.created_at - Fecha de creación
 */
app.put('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email } = req.body || {};

        if (!name && !email) {
            return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar (name o email)' });
        }

        // Construir la consulta dinámicamente según los campos proporcionados
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (name) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }

        if (email) {
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }

        values.push(id);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Violación de constraint único (email duplicado)
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

/**
 * Elimina un usuario por su ID
 * @route DELETE /users/:id
 * @param {number} id - ID del usuario a eliminar
 * @returns {void} 204 No Content si se elimina correctamente
 */
app.delete('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});




/**
 * Inicia el servidor Express
 * @listens {number} PORT - Puerto en el que escucha el servidor
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});