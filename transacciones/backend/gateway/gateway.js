const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { kafka, Topics } = require('../../shared/kafka-config');
const { EventEnvelope } = require('../../shared/events');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3002;

const consumer = kafka.consumer({ groupId: 'gateway-group' });

const subscriptions = new Map();

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('subscribe', ({ userId, transactionId }) => {
        const key = transactionId ? `txn:${transactionId}` : `user:${userId}`;
        
        if (!subscriptions.has(key)) {
            subscriptions.set(key, new Set());
        }
        subscriptions.get(key).add(socket.id);

        console.log(`Suscripción: ${socket.id} -> ${key}`);
        socket.emit('subscribed', { userId, transactionId });
    });

    socket.on('unsubscribe', ({ userId, transactionId }) => {
        const key = transactionId ? `txn:${transactionId}` : `user:${userId}`;
        
        if (subscriptions.has(key)) {
            subscriptions.get(key).delete(socket.id);
            if (subscriptions.get(key).size === 0) {
                subscriptions.delete(key);
            }
        }

        console.log(`Desuscripción: ${socket.id} -> ${key}`);
    });

    socket.on('disconnect', () => {
        for (const [key, sockets] of subscriptions.entries()) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
                subscriptions.delete(key);
            }
        }
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

function shouldNotify(event, userId, transactionId) {
    if (transactionId && event.transactionId === transactionId) {
        return true;
    }
    if (userId && event.userId === userId) {
        return true;
    }
    return false;
}

async function start() {
    await consumer.connect();
    console.log('Kafka consumer conectado');

    await consumer.subscribe({
        topic: Topics.EVENTS,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                
                const notifyKeys = [];
                
                for (const [key, sockets] of subscriptions.entries()) {
                    const [type, id] = key.split(':');
                    
                    if (type === 'txn' && event.transactionId === id) {
                        notifyKeys.push(key);
                    } else if (type === 'user' && event.userId === id) {
                        notifyKeys.push(key);
                    }
                }

                for (const key of notifyKeys) {
                    const sockets = subscriptions.get(key);
                    if (sockets) {
                        for (const socketId of sockets) {
                            io.to(socketId).emit('event', {
                                type: 'event',
                                data: event
                            });
                        }
                    }
                }

                console.log(`Evento ${event.type} enviado a ${notifyKeys.length} suscripciones`);
            } catch (error) {
                console.error('Error procesando evento:', error);
            }
        }
    });

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            service: 'gateway',
            connections: io.sockets.sockets.size,
            subscriptions: subscriptions.size
        });
    });

    server.listen(PORT, () => {
        console.log(`Gateway WebSocket corriendo en puerto ${PORT}`);
    });
}

start().catch(console.error);

process.on('SIGTERM', async () => {
    await consumer.disconnect();
    server.close();
    process.exit(0);
});

