# Sistema de Monitoreo de Red con Kafka

Aplicación web de monitoreo en tiempo real para simular y supervisar 5 nodos de una red de datos. El sistema utiliza un simulador de Kafka para procesar y visualizar métricas de red, incluyendo conexiones, latencia, caídas de servicio y alarmas.

## 🚀 Características

- **Simulación de 5 Nodos de Red**: Cada nodo con estado dinámico (online, offline, degraded)
- **Sistema de Eventos Kafka**: Simulador que genera eventos en tiempo real
- **Dashboard en Tiempo Real**: Visualización de métricas y estados
- **Gráficos de Latencia**: Historial de latencia de cada nodo
- **Sistema de Alarmas**: Notificaciones automáticas basadas en métricas
- **Log de Eventos**: Registro de todos los eventos del sistema

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 📦 Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Gráficos**: Recharts
- **Iconos**: Lucide React

## 🏗️ Estructura del Proyecto

```
monitoreo/
├── app/
│   ├── page.tsx          # Dashboard principal
│   ├── layout.tsx        # Layout de la aplicación
│   └── globals.css       # Estilos globales
├── components/
│   ├── node-card.tsx     # Tarjeta de estado de nodo
│   ├── stats-overview.tsx # Panel de estadísticas
│   ├── latency-chart.tsx # Gráfico de latencia
│   └── event-log.tsx     # Log de eventos
└── lib/
    ├── types.ts          # Definiciones de tipos
    └── kafka-simulator.ts # Simulador de Kafka
```

## 🎯 Funcionalidades

### Simulación de Nodos
- 5 nodos con nombres descriptivos
- Estados: online, offline, degraded
- Métricas de conexión y latencia
- Actualización continua de métricas

### Sistema de Eventos
- `NODE_STATUS_CHANGE`: Cambio de estado de nodo
- `LATENCY_UPDATE`: Actualización de latencia
- `CONNECTION_CHANGE`: Cambio en número de conexiones
- `ALARM`: Generación de alarmas

### Alarmas Automáticas
- **Crítico**: Nodo caído
- **Advertencia**: Latencia alta (> 300ms)
- **Info**: Conexiones bajas (< 50)

### Dashboard
- Panel de estadísticas generales
- Tarjetas de estado por nodo
- Gráfico de latencia histórica (últimos 20 puntos)
- Log de eventos (últimos 50 eventos)

## 📊 Métricas Monitoreadas

- Estado de nodos (online/offline/degraded)
- Latencia en milisegundos (50-500ms)
- Número de conexiones activas
- Alarmas y eventos del sistema

## 🎨 Interfaz

- Diseño moderno y responsive
- Código de colores para estados
- Indicadores de tendencia
- Actualización en tiempo real

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## 🔧 Desarrollo

El simulador de Kafka genera eventos cada 2 segundos de forma aleatoria. Los nodos cambian de estado de manera realista, simulando transiciones naturales entre estados.

## 📄 Licencia

ISC

