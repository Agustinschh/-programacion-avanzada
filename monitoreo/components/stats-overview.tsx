/**
 * Componente: StatsOverview (Panel de Estadísticas Generales)
 * 
 * Este componente muestra un resumen estadístico general de toda la red de nodos.
 * Presenta 4 métricas clave en tarjetas visuales con iconos y códigos de colores.
 * 
 * Métricas mostradas:
 * - Nodos Activos: Cantidad de nodos en estado "online" vs total de nodos
 * - Latencia Promedio: Promedio de latencia de todos los nodos en milisegundos
 * - Total Conexiones: Suma de todas las conexiones activas de todos los nodos
 * - Alarmas Activas: Cantidad de alarmas críticas y de advertencia activas
 * 
 * Funcionalidades:
 * - Cálculo automático de estadísticas agregadas a partir de los datos de nodos y alarmas
 * - Diseño responsive con grid que se adapta a diferentes tamaños de pantalla
 * - Iconos distintivos y códigos de colores para cada métrica
 * - Actualización en tiempo real cuando cambian los datos
 * 
 * Props:
 * - nodes: Array de todos los nodos de la red
 * - alarms: Array de todas las alarmas generadas
 */

'use client';

import { NetworkNode, Alarm } from '@/lib/types';
import { Server, Activity, AlertTriangle, Wifi } from 'lucide-react';

interface StatsOverviewProps {
  nodes: NetworkNode[];
  alarms: Alarm[];
}

export default function StatsOverview({ nodes, alarms }: StatsOverviewProps) {
  const activeNodes = nodes.filter(n => n.status === 'online').length;
  const averageLatency = nodes.length > 0
    ? Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length)
    : 0;
  const totalConnections = nodes.reduce((sum, n) => sum + n.activeConnections, 0);
  const activeAlarms = alarms.filter(a => a.severity === 'critical' || a.severity === 'warning').length;

  const stats = [
    {
      label: 'Nodos Activos',
      value: `${activeNodes}/${nodes.length}`,
      icon: Server,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Latencia Promedio',
      value: `${averageLatency}ms`,
      icon: Activity,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Total Conexiones',
      value: totalConnections.toLocaleString(),
      icon: Wifi,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'Alarmas Activas',
      value: activeAlarms.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-6 shadow-md border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className={`text-sm font-medium ${stat.textColor} mb-1`}>
              {stat.label}
            </h3>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

