'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface TransactionEvent {
  id: string
  type: string
  version: number
  ts: number
  transactionId: string
  userId: string
  payload: any
}

interface TimelineEvent {
  event: TransactionEvent
  timestamp: Date
  status: 'success' | 'warning' | 'error' | 'info'
  message: string
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    currency: 'USD',
    userId: ''
  })

  useEffect(() => {
    const newSocket = io('http://localhost:3002')
    
    newSocket.on('connect', () => {
      console.log('Conectado al WebSocket')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Desconectado del WebSocket')
      setConnected(false)
    })

    newSocket.on('event', (data: { type: string; data: TransactionEvent }) => {
      const event = data.data
      const status = getEventStatus(event.type)
      const message = getEventMessage(event)

      setTimeline(prev => [...prev, {
        event,
        timestamp: new Date(event.ts),
        status,
        message
      }])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const getEventStatus = (type: string): 'success' | 'warning' | 'error' | 'info' => {
    if (type.includes('Committed') || type.includes('Notified')) return 'success'
    if (type.includes('Reversed') || type.includes('FraudChecked') && type.includes('HIGH')) return 'error'
    if (type.includes('FraudChecked')) return 'warning'
    return 'info'
  }

  const getEventMessage = (event: TransactionEvent): string => {
    switch (event.type) {
      case 'txn.TransactionInitiated':
        return `Transacción iniciada: ${event.payload.amount} ${event.payload.currency}`
      case 'txn.FundsReserved':
        return `Fondos reservados: ${event.payload.amount} ${event.payload.currency}`
      case 'txn.FraudChecked':
        return `Verificación de fraude: Riesgo ${event.payload.risk}`
      case 'txn.Committed':
        return `Transacción confirmada: ID ${event.payload.ledgerTxId}`
      case 'txn.Reversed':
        return `Transacción revertida: ${event.payload.reason}`
      case 'txn.Notified':
        return `Notificación enviada: ${event.payload.message}`
      default:
        return event.type
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (response.ok) {
        setTransactionId(data.transactionId)
        setTimeline([])
        
        if (socket) {
          socket.emit('subscribe', {
            transactionId: data.transactionId,
            userId: formData.userId
          })
        }
      } else {
        alert('Error al iniciar transacción')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    }
  }

  const statusColors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Transacciones Bancarias
          </h1>
          <p className="text-gray-600">
            Simulación de transacciones con Kafka y actualizaciones en tiempo real
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Nueva Transacción
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta Origen
                </label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta Destino
                </label>
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user-123"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!connected}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Iniciar Transacción
              </button>
            </form>
            {transactionId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Transaction ID:</p>
                <p className="font-mono text-sm text-blue-700">{transactionId}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Timeline en Vivo
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {timeline.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay eventos aún. Inicia una transacción para ver el timeline.
                </p>
              ) : (
                timeline.map((item, index) => (
                  <div
                    key={`${item.event.id}-${index}`}
                    className={`p-4 rounded-lg border-l-4 ${statusColors[item.status]}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{item.message}</span>
                      <span className="text-xs opacity-75">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {item.event.type}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

