const { kafka, Topics } = require('../../shared/kafka-config');
const { EventEnvelope, EventTypes } = require('../../shared/events');

const consumer = kafka.consumer({ groupId: 'orchestrator-group' });
const producer = kafka.producer();

async function simulateFraudCheck() {
    const risk = Math.random() < 0.8 ? 'LOW' : 'HIGH';
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    return risk;
}

async function processTransaction(event) {
    const { transactionId, userId, payload } = event;
    const correlationId = event.id;

    try {
        console.log(`Procesando transacción: ${transactionId}`);

        const fundsReservedEvent = new EventEnvelope(
            EventTypes.FUNDS_RESERVED,
            {
                amount: payload.amount,
                currency: payload.currency,
                from: payload.from
            },
            transactionId,
            userId,
            correlationId
        );

        await producer.send({
            topic: Topics.EVENTS,
            messages: [{
                key: transactionId,
                value: JSON.stringify(fundsReservedEvent.toJSON())
            }]
        });

        console.log(`Fondos reservados: ${transactionId}`);

        const fraudRisk = await simulateFraudCheck();

        const fraudCheckedEvent = new EventEnvelope(
            EventTypes.FRAUD_CHECKED,
            { risk: fraudRisk },
            transactionId,
            userId,
            correlationId
        );

        await producer.send({
            topic: Topics.EVENTS,
            messages: [{
                key: transactionId,
                value: JSON.stringify(fraudCheckedEvent.toJSON())
            }]
        });

        console.log(`Fraud check completado: ${transactionId} - Risk: ${fraudRisk}`);

        if (fraudRisk === 'LOW') {
            const committedEvent = new EventEnvelope(
                EventTypes.COMMITTED,
                {
                    ledgerTxId: `ledger-${Date.now()}`,
                    to: payload.to,
                    amount: payload.amount,
                    currency: payload.currency
                },
                transactionId,
                userId,
                correlationId
            );

            await producer.send({
                topic: Topics.EVENTS,
                messages: [{
                    key: transactionId,
                    value: JSON.stringify(committedEvent.toJSON())
                }]
            });

            console.log(`Transacción confirmada: ${transactionId}`);

            const notifiedEvent = new EventEnvelope(
                EventTypes.NOTIFIED,
                {
                    channels: ['email', 'sms'],
                    message: `Transacción de ${payload.amount} ${payload.currency} completada`
                },
                transactionId,
                userId,
                correlationId
            );

            await producer.send({
                topic: Topics.EVENTS,
                messages: [{
                    key: transactionId,
                    value: JSON.stringify(notifiedEvent.toJSON())
                }]
            });

            console.log(`Notificación enviada: ${transactionId}`);
        } else {
            const reversedEvent = new EventEnvelope(
                EventTypes.REVERSED,
                {
                    reason: 'FraudHigh',
                    amount: payload.amount,
                    currency: payload.currency
                },
                transactionId,
                userId,
                correlationId
            );

            await producer.send({
                topic: Topics.EVENTS,
                messages: [{
                    key: transactionId,
                    value: JSON.stringify(reversedEvent.toJSON())
                }]
            });

            console.log(`Transacción revertida por fraude: ${transactionId}`);
        }
    } catch (error) {
        console.error(`Error procesando transacción ${transactionId}:`, error);

        const errorEvent = {
            originalEvent: event,
            error: {
                message: error.message,
                stack: error.stack,
                timestamp: Date.now()
            }
        };

        await producer.send({
            topic: Topics.DLQ,
            messages: [{
                key: transactionId,
                value: JSON.stringify(errorEvent)
            }]
        });

        console.log(`Error enviado a DLQ: ${transactionId}`);
    }
}

async function start() {
    await consumer.connect();
    await producer.connect();
    console.log('Kafka consumer y producer conectados');

    await consumer.subscribe({
        topic: Topics.COMMANDS,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const eventData = JSON.parse(message.value.toString());
                
                if (eventData.type === EventTypes.TRANSACTION_INITIATED) {
                    await processTransaction(eventData);
                }
            } catch (error) {
                console.error('Error procesando mensaje:', error);
            }
        }
    });

    console.log('Orchestrator escuchando en txn.commands');
}

start().catch(console.error);

process.on('SIGTERM', async () => {
    await consumer.disconnect();
    await producer.disconnect();
    process.exit(0);
});

