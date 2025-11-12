/**
 * Componente: NodeCard (Tarjeta de Nodo)
 * 
 * Este componente representa visualmente el estado de un nodo de red individual.
 * Muestra información clave del nodo en una tarjeta con diseño moderno y código de colores.
 * 
 * Funcionalidades:
 * - Visualización del estado del nodo con indicador de color (verde/amarillo/rojo)
 * - Mostrar latencia actual con código de colores según el rango (verde < 100ms, amarillo < 300ms, rojo >= 300ms)
 * - Indicador de tendencia de latencia (mejorando/empeorando/estable) mediante iconos
 * - Mostrar número de conexiones activas
 * - Timestamp de última actualización
 * - Diseño responsive con efectos hover
 * 
 * Props:
 * - node: Objeto NetworkNode con toda la información del nodo a mostrar
 */

'use client';

import { NetworkNode } from '@/lib/types';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NodeCardProps {
  node: NetworkNode;
}

export default function NodeCard({ node }: NodeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'degraded':
        return 'Degradado';
      case 'offline':
        return 'Desconectado';
      default:
        return status;
    }
  };

  const getTrendIcon = () => {
    if (!node.previousLatency) return <Minus className="w-4 h-4 text-gray-400" />;
    
    if (node.latency < node.previousLatency) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    } else if (node.latency > node.previousLatency) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-600';
    if (latency < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
          <h3 className="text-lg font-semibold text-gray-800">{node.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          node.status === 'online' ? 'bg-green-100 text-green-800' :
          node.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getStatusText(node.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Latencia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${getLatencyColor(node.latency)}`}>
              {node.latency}ms
            </span>
            {getTrendIcon()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Conexiones</span>
          </div>
          <span className="font-semibold text-gray-800">
            {node.activeConnections}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Última actualización: {node.lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

