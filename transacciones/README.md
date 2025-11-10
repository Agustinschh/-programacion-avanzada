# Sistema de Transacciones Bancarias con Kafka

Sistema completo de simulación de transacciones bancarias usando Kafka para eventos y WebSocket para actualizaciones en tiempo real.

## 🏗️ Arquitectura

- **API Service**: Recibe POST /transactions y publica a `txn.commands`
- **Orchestrator Service**: Consume `txn.commands`, procesa transacciones y emite `txn.events`
- **Gateway WebSocket**: Consume `txn.events` y reenvía por WebSocket a la aplicación
- **Frontend Next.js**: Interfaz web para iniciar transacciones y visualizar timeline en vivo

## 📋 Requisitos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

## 🚀 Instalación

### 1. Iniciar Kafka

```bash
docker-compose up -d
```

Esto iniciará:
- Zookeeper (puerto 2181)
- Kafka (puerto 9092)
- Kafka UI (puerto 8080) - http://localhost:8080

### 2. Instalar dependencias

```bash
# Shared
cd shared && npm install

# API Service
cd ../backend/api && npm install

# Orchestrator Service
cd ../orchestrator && npm install

# Gateway Service
cd ../gateway && npm install

# Frontend
cd ../../frontend && npm install
```

### 3. Iniciar servicios

En terminales separadas:

```bash
# Terminal 1: API Service
cd backend/api && npm run dev

# Terminal 2: Orchestrator Service
cd backend/orchestrator && npm run dev

# Terminal 3: Gateway WebSocket
cd backend/gateway && npm run dev

# Terminal 4: Frontend
cd frontend && npm run dev
```

## 📡 Endpoints

### API Service (puerto 3001)

- `POST /transactions` - Iniciar una nueva transacción
- `GET /health` - Health check

### Gateway WebSocket (puerto 3002)

- WebSocket en `ws://localhost:3002`
- Eventos: `subscribe`, `unsubscribe`, `event`

## 🎯 Uso

1. Abre http://localhost:3000 en tu navegador
2. Completa el formulario de transacción
3. Haz clic en "Iniciar Transacción"
4. Observa el timeline en tiempo real con los eventos de la transacción

## 📊 Eventos

- `txn.TransactionInitiated` - Transacción iniciada
- `txn.FundsReserved` - Fondos reservados
- `txn.FraudChecked` - Verificación de fraude (LOW/HIGH)
- `txn.Committed` - Transacción confirmada (si riesgo bajo)
- `txn.Reversed` - Transacción revertida (si riesgo alto)
- `txn.Notified` - Notificación enviada

## 🐳 Docker

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f kafka
```

## 📁 Estructura

```
transacciones/
├── backend/
│   ├── api/           # API Service
│   ├── orchestrator/  # Orchestrator Service
│   └── gateway/       # Gateway WebSocket
├── frontend/          # Next.js App
├── shared/            # Código compartido
└── docker-compose.yml # Kafka y Zookeeper
```

