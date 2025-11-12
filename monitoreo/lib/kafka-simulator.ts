/**
 * Módulo Simulador de Kafka
 * 
 * Este módulo implementa un simulador de Apache Kafka que genera eventos en tiempo real
 * para simular el comportamiento de una red de datos. El simulador gestiona 5 nodos de red,
 * genera eventos aleatorios cada 2 segundos y mantiene un sistema de suscripción/notificación
 * similar al patrón pub/sub de Kafka.
 * 
 * Funcionalidades principales:
 * - Inicialización y gestión de 5 nodos de red con estados dinámicos
 * - Generación de eventos aleatorios: cambios de estado, actualizaciones de latencia,
 *   cambios de conexiones y generación de alarmas
 * - Sistema de suscripción con callbacks para notificar cambios a los componentes
 * - Mantenimiento de historial de latencia (últimos 20 puntos por nodo)
 * - Generación automática de alarmas basadas en métricas (latencia alta, nodo caído, etc.)
 * - Procesamiento cronológico de eventos mediante cola de eventos
 * 
 * Patrón de diseño: Singleton - una única instancia del simulador para toda la aplicación
 */

import { NetworkNode, NetworkEvent, EventType, NodeStatus, AlarmSeverity, EventCallback, Alarm } from './types';

export class KafkaSimulator {
  private nodes: NetworkNode[] = [];
  private subscribers: EventCallback[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private latencyHistory: Map<string, number[]> = new Map();
  private alarms: Alarm[] = [];
  private eventQueue: NetworkEvent[] = [];

  constructor() {
    this.initializeNodes();
  }

  private initializeNodes() {
    const nodeNames = [
      'Router Principal',
      'Switch Core',
      'Servidor Web',
      'Base de Datos',
      'Balanceador de Carga'
    ];

    for (let i = 0; i < 5; i++) {
      const node: NetworkNode = {
        id: `node-${i + 1}`,
        name: nodeNames[i],
        status: 'online',
        activeConnections: Math.floor(Math.random() * 200) + 50,
        latency: Math.floor(Math.random() * 200) + 50,
        lastUpdate: new Date(),
      };
      this.nodes.push(node);
      this.latencyHistory.set(node.id, [node.latency]);
    }
  }

  subscribe(callback: EventCallback): () => void {
    this.subscribers.push(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private emit(event: NetworkEvent) {
    // Agregar a la cola de eventos
    this.eventQueue.push(event);
    
    // Procesar eventos en orden cronológico
    this.eventQueue.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Notificar a todos los suscriptores
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error en callback:', error);
      }
    });
  }

  start(intervalMs: number = 2000) {
    if (this.intervalId) {
      this.stop();
    }

    this.intervalId = setInterval(() => {
      this.simulateEvents();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private simulateEvents() {
    // Seleccionar un nodo aleatorio para generar eventos
    const nodeIndex = Math.floor(Math.random() * this.nodes.length);
    const node = this.nodes[nodeIndex];
    
    // Decidir qué tipo de evento generar (aleatorio)
    const eventType = Math.random();

    if (eventType < 0.3) {
      // 30% probabilidad: Cambio de estado
      this.simulateStatusChange(node);
    } else if (eventType < 0.6) {
      // 30% probabilidad: Actualización de latencia
      this.simulateLatencyUpdate(node);
    } else if (eventType < 0.9) {
      // 30% probabilidad: Cambio de conexiones
      this.simulateConnectionChange(node);
    } else {
      // 10% probabilidad: Verificar y generar alarmas
      this.checkAndGenerateAlarms(node);
    }
  }

  private simulateStatusChange(node: NetworkNode) {
    const statuses: NodeStatus[] = ['online', 'degraded', 'offline'];
    const currentIndex = statuses.indexOf(node.status);
    
    // Transiciones realistas
    let newStatus: NodeStatus;
    if (node.status === 'online') {
      newStatus = Math.random() < 0.7 ? 'degraded' : 'online';
    } else if (node.status === 'degraded') {
      newStatus = Math.random() < 0.5 ? 'online' : (Math.random() < 0.7 ? 'degraded' : 'offline');
    } else {
      newStatus = Math.random() < 0.3 ? 'degraded' : 'offline';
    }

    if (newStatus !== node.status) {
      node.status = newStatus;
      node.lastUpdate = new Date();

      const event: NetworkEvent = {
        type: 'NODE_STATUS_CHANGE',
        timestamp: new Date(),
        nodeId: node.id,
        data: { status: newStatus },
        metadata: { previousStatus: statuses[currentIndex] }
      };

      this.emit(event);

      // Generar alarma si el nodo se cae
      if (newStatus === 'offline') {
        this.generateAlarm(node, 'critical', 'Nodo caído - Sin conexión');
      }
    }
  }

  private simulateLatencyUpdate(node: NetworkNode) {
    if (node.status === 'offline') return;

    const previousLatency = node.latency;
    let newLatency: number;

    // Variación de latencia basada en el estado actual
    if (node.status === 'online') {
      newLatency = Math.floor(Math.random() * 150) + 50; // 50-200ms
    } else if (node.status === 'degraded') {
      newLatency = Math.floor(Math.random() * 200) + 200; // 200-400ms
    } else {
      newLatency = Math.floor(Math.random() * 100) + 400; // 400-500ms
    }

    node.previousLatency = previousLatency;
    node.latency = newLatency;
    node.lastUpdate = new Date();

    // Mantener historial (últimos 20 puntos)
    const history = this.latencyHistory.get(node.id) || [];
    history.push(newLatency);
    if (history.length > 20) {
      history.shift();
    }
    this.latencyHistory.set(node.id, history);

    const event: NetworkEvent = {
      type: 'LATENCY_UPDATE',
      timestamp: new Date(),
      nodeId: node.id,
      data: { latency: newLatency },
      metadata: { previousLatency }
    };

    this.emit(event);
  }

  private simulateConnectionChange(node: NetworkNode) {
    if (node.status === 'offline') {
      node.activeConnections = 0;
      return;
    }

    const change = Math.floor(Math.random() * 40) - 20; // -20 a +20
    const newConnections = Math.max(0, node.activeConnections + change);
    const previousConnections = node.activeConnections;

    node.activeConnections = newConnections;
    node.lastUpdate = new Date();

    const event: NetworkEvent = {
      type: 'CONNECTION_CHANGE',
      timestamp: new Date(),
      nodeId: node.id,
      data: { connections: newConnections },
      metadata: { previousConnections }
    };

    this.emit(event);
  }

  private checkAndGenerateAlarms(node: NetworkNode) {
    // Alarma por latencia alta
    if (node.latency > 300 && node.status !== 'offline') {
      this.generateAlarm(node, 'warning', `Latencia alta: ${node.latency}ms`);
    }

    // Alarma por conexiones bajas
    if (node.activeConnections < 50 && node.status === 'online') {
      this.generateAlarm(node, 'info', `Conexiones bajas: ${node.activeConnections}`);
    }
  }

  private generateAlarm(
    node: NetworkNode, 
    severity: AlarmSeverity, 
    message: string
  ) {
    const alarm = {
      id: `alarm-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      nodeId: node.id,
      severity,
      message,
      type: 'ALARM' as EventType
    };

    // Mantener solo las últimas 50 alarmas
    this.alarms.push(alarm);
    if (this.alarms.length > 50) {
      this.alarms.shift();
    }

    const event: NetworkEvent = {
      type: 'ALARM',
      timestamp: new Date(),
      nodeId: node.id,
      data: {
        severity,
        message
      }
    };

    this.emit(event);
  }

  getNodes(): NetworkNode[] {
    return [...this.nodes];
  }

  getLatencyHistory(nodeId: string): number[] {
    return [...(this.latencyHistory.get(nodeId) || [])];
  }

  getAlarms() {
    return [...this.alarms];
  }

  getEventQueue(): NetworkEvent[] {
    return [...this.eventQueue];
  }
}

// Instancia singleton
let simulatorInstance: KafkaSimulator | null = null;

export function getKafkaSimulator(): KafkaSimulator {
  if (!simulatorInstance) {
    simulatorInstance = new KafkaSimulator();
  }
  return simulatorInstance;
}

