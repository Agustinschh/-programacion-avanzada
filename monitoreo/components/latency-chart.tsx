/**
 * Componente: LatencyChart (Gráfico de Latencia)
 * 
 * Este componente visualiza el historial de latencia de todos los nodos de la red
 * mediante un gráfico de líneas interactivo. Utiliza la librería Recharts para
 * renderizar el gráfico con múltiples series de datos.
 * 
 * Funcionalidades:
 * - Muestra el historial de latencia de los últimos 20 puntos de datos por nodo
 * - Cada nodo tiene su propia línea en el gráfico con un color distintivo
 * - Eje X: Tiempo (puntos de datos secuenciales)
 * - Eje Y: Latencia en milisegundos
 * - Tooltip interactivo que muestra valores al pasar el mouse
 * - Leyenda que identifica cada nodo por color
 * - Diseño responsive que se adapta al contenedor
 * 
 * Datos:
 * - Obtiene el historial de latencia directamente del simulador de Kafka
 * - Los datos se actualizan automáticamente cuando el componente se re-renderiza
 * 
 * Props:
 * - nodes: Array de nodos para los cuales se mostrará el historial de latencia
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NetworkNode } from '@/lib/types';
import { getKafkaSimulator } from '@/lib/kafka-simulator';

interface LatencyChartProps {
  nodes: NetworkNode[];
}

export default function LatencyChart({ nodes }: LatencyChartProps) {
  const simulator = getKafkaSimulator();
  
  // Preparar datos para el gráfico
  const chartData: Array<Record<string, any>> = [];
  
  // Obtener el historial de latencia de cada nodo
  const maxHistoryLength = Math.max(
    ...nodes.map(node => {
      const history = simulator.getLatencyHistory(node.id);
      return history.length;
    })
  );

  // Crear un array de datos para cada punto en el tiempo
  for (let i = 0; i < maxHistoryLength; i++) {
    const dataPoint: Record<string, any> = {
      time: i + 1
    };
    
    nodes.forEach(node => {
      const history = simulator.getLatencyHistory(node.id);
      if (history[i] !== undefined) {
        dataPoint[node.name] = history[i];
      }
    });
    
    chartData.push(dataPoint);
  }

  // Colores para cada nodo
  const colors = [
    '#3b82f6', // azul
    '#10b981', // verde
    '#f59e0b', // amarillo
    '#ef4444', // rojo
    '#8b5cf6'  // morado
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Historial de Latencia
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Tiempo', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: 'Latencia (ms)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {nodes.map((node, index) => (
            <Line
              key={node.id}
              type="monotone"
              dataKey={node.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2">
        Mostrando últimos 20 puntos de datos por nodo
      </p>
    </div>
  );
}

