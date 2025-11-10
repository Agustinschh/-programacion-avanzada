const { v4: uuidv4 } = require('uuid');

class EventEnvelope {
    constructor(type, payload, transactionId, userId, correlationId = null) {
        this.id = uuidv4();
        this.type = type;
        this.version = 1;
        this.ts = Date.now();
        this.transactionId = transactionId;
        this.userId = userId;
        this.payload = payload;
        if (correlationId) {
            this.correlationId = correlationId;
        }
    }

    toJSON() {
        const obj = {
            id: this.id,
            type: this.type,
            version: this.version,
            ts: this.ts,
            transactionId: this.transactionId,
            userId: this.userId,
            payload: this.payload
        };
        if (this.correlationId) {
            obj.correlationId = this.correlationId;
        }
        return obj;
    }

    static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const envelope = new EventEnvelope(
            json.type,
            json.payload,
            json.transactionId,
            json.userId,
            json.correlationId || null
        );
        envelope.id = json.id;
        envelope.version = json.version;
        envelope.ts = json.ts;
        return envelope;
    }
}

const EventTypes = {
    TRANSACTION_INITIATED: 'txn.TransactionInitiated',
    FUNDS_RESERVED: 'txn.FundsReserved',
    FRAUD_CHECKED: 'txn.FraudChecked',
    COMMITTED: 'txn.Committed',
    REVERSED: 'txn.Reversed',
    NOTIFIED: 'txn.Notified'
};

module.exports = {
    EventEnvelope,
    EventTypes
};

