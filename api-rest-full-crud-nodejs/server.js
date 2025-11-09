// Servidor Express API REST
const express = require('express');
const pool = require('./db');

// Aplicación Express
const app = express();

// Puerto servidor
const PORT = process.env.PORT || 3000;

// Middleware JSON
app.use(express.json());

// Listar usuarios
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener usuario
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

// Crear usuario
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
        if (error.code === '23505') { // Email duplicado
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Actualizar usuario
app.put('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email } = req.body || {};

        if (!name && !email) {
            return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar (name o email)' });
        }

        // Construir consulta dinámica
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
        if (error.code === '23505') { // Email duplicado
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario
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




// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});