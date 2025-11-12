/**
 * Página Principal: Dashboard de Monitoreo
 * 
 * Esta es la página principal del sistema de monitoreo de red. Coordina todos los
 * componentes del dashboard y gestiona el estado global de la aplicación.
 * 
 * Funcionalidades principales:
 * - Inicializa y gestiona el simulador de Kafka
 * - Suscribe a eventos del simulador para actualizaciones en tiempo real
 * - Mantiene el estado de los nodos y alarmas en el componente
 * - Coordina la renderización de todos los componentes del dashboard:
 *   - StatsOverview: Panel de estadísticas generales
 *   - NodeCard: Tarjetas individuales de cada nodo
 *   - LatencyChart: Gráfico de latencia histórica
 *   - EventLog: Log de eventos y alarmas
 * - Muestra el estado de ejecución del sistema (en ejecución/detenido)
 * - Gestiona el ciclo de vida del simulador (inicio/limpieza)
 * 
 * Flujo de datos:
 * 1. Al montar el componente, obtiene la instancia del simulador
 * 2. Se suscribe a eventos del simulador mediante callback
 * 3. Cuando llega un evento, actualiza el estado local
 * 4. Los componentes hijos se re-renderizan automáticamente con los nuevos datos
 * 5. Al desmontar, limpia la suscripción y detiene el simulador
 * 
 * Layout:
 * - Header: Título y estado del sistema
 * - StatsOverview: 4 tarjetas de estadísticas
 * - Grid de NodeCards: 5 tarjetas (una por nodo)
 * - Grid de LatencyChart y EventLog: Gráfico y log lado a lado
 * - Footer: Información del sistema
 */

'use client';

import { useEffect, useState } from 'react';
import { NetworkNode, NetworkEvent, Alarm } from '@/lib/types';
import { getKafkaSimulator } from '@/lib/kafka-simulator';
import NodeCard from '@/components/node-card';
import StatsOverview from '@/components/stats-overview';
import LatencyChart from '@/components/latency-chart';
import EventLog from '@/components/event-log';
import { Activity } from 'lucide-react';

export default function Home() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const simulator = getKafkaSimulator();
    
    // Inicializar nodos
    setNodes(simulator.getNodes());
    setAlarms(simulator.getAlarms());

    // Suscribirse a eventos
    const unsubscribe = simulator.subscribe((event: NetworkEvent) => {
      // Actualizar nodos cuando hay cambios
      const updatedNodes = simulator.getNodes();
      setNodes(updatedNodes);

      // Actualizar alarmas si es un evento de alarma
      if (event.type === 'ALARM') {
        const updatedAlarms = simulator.getAlarms();
        setAlarms(updatedAlarms);
      }
    });

    // Iniciar simulación
    simulator.start(2000); // Eventos cada 2 segundos
    setIsRunning(true);

    // Cleanup
    return () => {
      unsubscribe();
      simulator.stop();
      setIsRunning(false);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Monitoreo de Red
                </h1>
                <p className="text-sm text-gray-500">
                  Dashboard en tiempo real con Kafka
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isRunning ? 'En ejecución' : 'Detenido'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel de estadísticas */}
        <StatsOverview nodes={nodes} alarms={alarms} />

        {/* Tarjetas de nodos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Estado de los Nodos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>

        {/* Gráfico de latencia y log de eventos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatencyChart nodes={nodes} />
          <EventLog alarms={alarms} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Sistema de Monitoreo de Red - Programación Avanzada 2025
          </p>
        </div>
      </footer>
    </main>
  );
}

