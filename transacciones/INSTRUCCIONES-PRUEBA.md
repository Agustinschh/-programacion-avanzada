# Instrucciones para Probar el Sistema de Transacciones

## ✅ Estado Actual

- ✅ Todas las dependencias instaladas
- ✅ Sintaxis de código verificada
- ✅ Módulos compartidos funcionando correctamente
- ✅ Estructura de archivos completa

## 🚀 Pasos para Probar el Sistema

### 1. Iniciar Kafka (Docker)

```bash
cd transacciones
docker-compose up -d
```

Espera 10-15 segundos para que Kafka esté listo.

Verifica que los contenedores estén corriendo:
```bash
docker ps
```

Deberías ver:
- zookeeper
- kafka
- kafka-ui

Kafka UI estará disponible en: http://localhost:8080

### 2. Iniciar los Servicios Backend

Abre 3 terminales separadas:

**Terminal 1 - API Service:**
```bash
cd transacciones/backend/api
npm run dev
```
Debería mostrar: "API Service corriendo en puerto 3001"

**Terminal 2 - Orchestrator Service:**
```bash
cd transacciones/backend/orchestrator
npm run dev
```
Debería mostrar: "Orchestrator escuchando en txn.commands"

**Terminal 3 - Gateway WebSocket:**
```bash
cd transacciones/backend/gateway
npm run dev
```
Debería mostrar: "Gateway WebSocket corriendo en puerto 3002"

### 3. Iniciar el Frontend

**Terminal 4 - Frontend:**
```bash
cd transacciones/frontend
npm run dev
```

El frontend estará disponible en: http://localhost:3000

### 4. Probar el Sistema

1. Abre http://localhost:3000 en tu navegador
2. Verifica que el indicador muestre "Conectado" (círculo verde)
3. Completa el formulario:
   - Cuenta Origen: `ACC-001`
   - Cuenta Destino: `ACC-002`
   - Monto: `1000`
   - Moneda: `USD`
   - User ID: `user-123`
4. Haz clic en "Iniciar Transacción"
5. Observa el timeline en tiempo real:
   - Transacción iniciada
   - Fondos reservados
   - Verificación de fraude
   - Transacción confirmada o revertida (dependiendo del riesgo)
   - Notificación enviada

### 5. Verificar en Kafka UI

1. Abre http://localhost:8080
2. Ve a "Topics"
3. Deberías ver:
   - `txn.commands` - Comandos de transacciones
   - `txn.events` - Eventos de transacciones
   - `txn.dlq` - Dead Letter Queue (si hay errores)
4. Puedes ver los mensajes en cada tópico

## 🧪 Pruebas Adicionales

### Probar con cURL

```bash
# Crear una transacción
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "from": "ACC-001",
    "to": "ACC-002",
    "amount": "500",
    "currency": "USD",
    "userId": "user-123"
  }'
```

### Verificar Health Checks

```bash
# API Service
curl http://localhost:3001/health

# Gateway WebSocket
curl http://localhost:3002/health
```

## 🐛 Solución de Problemas

### Kafka no inicia
- Verifica que Docker esté corriendo
- Verifica que los puertos 2181, 9092, 8080 estén libres
- Revisa los logs: `docker-compose logs`

### Servicios no se conectan a Kafka
- Espera 15-20 segundos después de iniciar Docker
- Verifica que Kafka esté listo: `docker ps`
- Revisa los logs de cada servicio

### Frontend no se conecta al WebSocket
- Verifica que el Gateway esté corriendo en puerto 3002
- Verifica la consola del navegador para errores
- Asegúrate de que el indicador muestre "Conectado"

## 📊 Flujo de Eventos Esperado

1. **POST /transactions** → API Service
2. **txn.TransactionInitiated** → Kafka (txn.commands)
3. **Orchestrator consume** → Procesa transacción
4. **txn.FundsReserved** → Kafka (txn.events)
5. **txn.FraudChecked** → Kafka (txn.events)
6. **txn.Committed** o **txn.Reversed** → Kafka (txn.events)
7. **txn.Notified** → Kafka (txn.events)
8. **Gateway consume eventos** → WebSocket → Frontend
9. **Timeline actualizado** → Usuario ve eventos en tiempo real

## ✅ Checklist de Verificación

- [ ] Kafka corriendo (docker ps)
- [ ] API Service corriendo (puerto 3001)
- [ ] Orchestrator Service corriendo
- [ ] Gateway WebSocket corriendo (puerto 3002)
- [ ] Frontend corriendo (puerto 3000)
- [ ] Frontend muestra "Conectado"
- [ ] Se puede crear una transacción
- [ ] Timeline muestra eventos en tiempo real
- [ ] Kafka UI muestra mensajes en los tópicos


