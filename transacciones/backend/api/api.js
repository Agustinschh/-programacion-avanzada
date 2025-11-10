const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { kafka, Topics } = require('../../shared/kafka-config');
const { EventEnvelope, EventTypes } = require('../../shared/events');

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const PORT = process.env.PORT || 3001;

const producer = kafka.producer();

async function start() {
    try {
        await producer.connect();
        console.log('Kafka producer conectado');
    } catch (error) {
        console.error('Error conectando producer a Kafka:', error);
        console.error('Detalles:', error.message, error.stack);
    }

    app.post('/transactions', async (req, res) => {
        try {
            const { from, to, amount, currency, userId } = req.body;

            if (!from || !to || !amount || !currency || !userId) {
                return res.status(400).json({
                    error: 'Faltan campos requeridos: from, to, amount, currency, userId'
                });
            }

            const transactionId = uuidv4();

            const event = new EventEnvelope(
                EventTypes.TRANSACTION_INITIATED,
                {
                    from,
                    to,
                    amount: parseFloat(amount),
                    currency
                },
                transactionId,
                userId
            );

            await producer.send({
                topic: Topics.COMMANDS,
                messages: [{
                    key: transactionId,
                    value: JSON.stringify(event.toJSON())
                }]
            });

            console.log(`Transacción iniciada: ${transactionId}`);

            res.status(202).json({
                transactionId,
                status: 'initiated',
                message: 'Transacción iniciada correctamente'
            });
        } catch (error) {
            console.error('Error al procesar transacción:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    });

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: 'api' });
    });

    app.listen(PORT, () => {
        console.log(`API Service corriendo en puerto ${PORT}`);
    });
}

start().catch(console.error);

process.on('SIGTERM', async () => {
    await producer.disconnect();
    process.exit(0);
});

