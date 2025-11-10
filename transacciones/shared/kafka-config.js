const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'banking-transactions',
    brokers: ['localhost:9092']
});

const Topics = {
    COMMANDS: 'txn.commands',
    EVENTS: 'txn.events',
    DLQ: 'txn.dlq'
};

module.exports = {
    kafka,
    Topics
};

