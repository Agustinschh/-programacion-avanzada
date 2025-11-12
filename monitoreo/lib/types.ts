/**
 * Módulo de Definiciones de Tipos
 * 
 * Este módulo contiene todas las definiciones de tipos TypeScript utilizadas en el sistema
 * de monitoreo de red. Define las estructuras de datos para nodos, eventos, alarmas y
 * los tipos enumerados que representan los diferentes estados y tipos de eventos del sistema.
 * 
 * Tipos principales:
 * - NodeStatus: Estados posibles de un nodo (online, offline, degraded)
 * - EventType: Tipos de eventos que puede generar el simulador de Kafka
 * - AlarmSeverity: Niveles de severidad de las alarmas (info, warning, critical)
 * - NetworkNode: Estructura que representa un nodo de red con sus métricas
 * - NetworkEvent: Estructura que representa un evento del sistema
 * - Alarm: Estructura que representa una alarma generada por el sistema
 * - EventCallback: Tipo de función callback para suscripción a eventos
 */

export type NodeStatus = 'online' | 'offline' | 'degraded';

export type EventType = 
  | 'NODE_STATUS_CHANGE' 
  | 'LATENCY_UPDATE' 
  | 'CONNECTION_CHANGE' 
  | 'ALARM';

export type AlarmSeverity = 'info' | 'warning' | 'critical';

export interface NetworkNode {
  id: string;
  name: string;
  status: NodeStatus;
  activeConnections: number;
  latency: number; // en milisegundos
  lastUpdate: Date;
  previousLatency?: number; // para calcular tendencia
}

export interface NetworkEvent {
  type: EventType;
  timestamp: Date;
  nodeId: string;
  data: {
    status?: NodeStatus;
    latency?: number;
    connections?: number;
    severity?: AlarmSeverity;
    message?: string;
  };
  metadata?: Record<string, any>;
}

export interface Alarm {
  id: string;
  timestamp: Date;
  nodeId: string;
  severity: AlarmSeverity;
  message: string;
  type: EventType;
}

export type EventCallback = (event: NetworkEvent) => void;

