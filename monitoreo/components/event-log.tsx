/**
 * Componente: EventLog (Log de Eventos)
 * 
 * Este componente muestra un registro cronológico de todos los eventos y alarmas
 * generados por el sistema. Presenta los eventos más recientes primero con información
 * detallada sobre cada uno.
 * 
 * Funcionalidades:
 * - Muestra las últimas 50 alarmas/eventos generados por el sistema
 * - Código de colores según la severidad (crítico: rojo, advertencia: amarillo, info: azul)
 * - Iconos distintivos para cada nivel de severidad
 * - Información mostrada por evento:
 *   - Timestamp (fecha y hora)
 *   - Nivel de severidad con badge
 *   - ID del nodo afectado
 *   - Mensaje descriptivo del evento
 * - Scroll vertical para navegar por el historial
 * - Diseño de tarjetas con efectos hover
 * 
 * Tipos de alarmas mostradas:
 * - CRITICAL: Nodo caído, problemas graves
 * - WARNING: Latencia alta, problemas moderados
 * - INFO: Conexiones bajas, información general
 * 
 * Props:
 * - alarms: Array de alarmas a mostrar en el log
 */

'use client';

import { Alarm } from '@/lib/types';
import { AlertCircle, Info, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface EventLogProps {
  alarms: Alarm[];
}

export default function EventLog({ alarms }: EventLogProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mostrar las últimas 50 alarmas (ya están ordenadas por timestamp)
  const recentAlarms = alarms.slice(-50).reverse();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Log de Eventos
      </h2>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {recentAlarms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No hay eventos registrados</p>
          </div>
        ) : (
          recentAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`${getSeverityColor(alarm.severity)} border rounded-lg p-4 flex items-start gap-3 hover:shadow-md transition-shadow`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(alarm.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadge(alarm.severity)}`}>
                      {alarm.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Nodo: {alarm.nodeId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {alarm.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{alarm.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {alarm.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Mostrando últimos {recentAlarms.length} eventos
      </p>
    </div>
  );
}

