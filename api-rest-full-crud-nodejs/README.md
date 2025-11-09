# API REST Full CRUD Node.js

API REST completa con operaciones CRUD para gestión de usuarios, utilizando Node.js, Express y PostgreSQL en Docker.

## 🚀 Características

- ✅ Operaciones CRUD completas (Create, Read, Update, Delete)
- 🐘 Base de datos PostgreSQL en Docker
- 📝 Documentación JSDoc en español
- 🔒 Validación de datos y manejo de errores
- 🎯 Endpoints RESTful bien estructurados

## 📋 Requisitos

- Node.js (v14 o superior)
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar la base de datos PostgreSQL en Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints

### GET /users
Obtiene todos los usuarios registrados.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "created_at": "2025-01-09T15:00:00.000Z"
  }
]
```

### GET /users/:id
Obtiene un usuario específico por su ID.

**Parámetros:**
- `id` (number): ID del usuario

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "created_at": "2025-01-09T15:00:00.000Z"
}
```

### POST /users
Crea un nuevo usuario.

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "created_at": "2025-01-09T15:00:00.000Z"
}
```

### PUT /users/:id
Actualiza un usuario existente.

**Parámetros:**
- `id` (number): ID del usuario a actualizar

**Body (JSON):**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

**Nota:** Puedes actualizar solo `name`, solo `email`, o ambos.

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "created_at": "2025-01-09T15:00:00.000Z"
}
```

### DELETE /users/:id
Elimina un usuario por su ID.

**Parámetros:**
- `id` (number): ID del usuario a eliminar

**Respuesta:** 204 No Content

## 🗄️ Base de Datos

La base de datos PostgreSQL se ejecuta en un contenedor Docker. La configuración se encuentra en `docker-compose.yml`.

### Configuración por defecto:
- **Host:** localhost
- **Puerto:** 5432
- **Base de datos:** api_rest_db
- **Usuario:** postgres
- **Contraseña:** postgres

### Variables de entorno

Puedes configurar la conexión a la base de datos usando variables de entorno:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_rest_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

## 📁 Estructura del Proyecto

```
api-rest-full-crud-nodejs/
├── server.js          # Servidor Express y rutas
├── db.js              # Configuración de PostgreSQL
├── docker-compose.yml # Configuración de Docker
├── init.sql           # Script de inicialización de la BD
├── package.json       # Dependencias del proyecto
└── README.md          # Este archivo
```

## 🧪 Ejemplos de uso

### Crear un usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com"}'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3000/users
```

### Obtener un usuario por ID
```bash
curl http://localhost:3000/users/1
```

### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Carlos Pérez"}'
```

### Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/users/1
```

## 🛑 Detener la base de datos

Para detener y eliminar el contenedor de PostgreSQL:

```bash
docker-compose down
```

Para detener y eliminar el contenedor junto con los volúmenes (esto eliminará los datos):

```bash
docker-compose down -v
```

## 📝 Notas

- Los datos se persisten en un volumen de Docker, por lo que se mantienen aunque reinicies el contenedor
- El email debe ser único (constraint UNIQUE en la base de datos)
- Todos los endpoints devuelven JSON
- Los errores se manejan con códigos de estado HTTP apropiados

## 🐛 Manejo de Errores

- **400 Bad Request:** Datos inválidos o faltantes
- **404 Not Found:** Usuario no encontrado
- **500 Internal Server Error:** Error del servidor

## 📚 Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución
- **Express:** Framework web
- **PostgreSQL:** Base de datos relacional
- **pg:** Cliente de PostgreSQL para Node.js
- **Docker:** Contenedorización
- **Docker Compose:** Orquestación de contenedores

## 👤 Autor

@erneledesma

## 📄 Licencia

MIT

