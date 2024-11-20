const express = require('express');
const redis = require('redis');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

// Redis Client
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Kafka Producer
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

(async () => {
    await producer.connect();
})();

app.post('/register', async (req, res) => {
    try {
        const clientId = req.header('Client_id');
        if (!clientId) return res.status(400).json({ error: 'Client_id is required' });

        // Check Redis for client status
        const clientStatus = await redisClient.get(`client_status:${clientId}`);
        if (clientStatus !== 'active') {
            return res.status(403).json({ message: 'Client not active' });
        }

        // Send data to Kafka
        const userData = req.body;
        await producer.send({
            topic: 'registration',
            messages: [{ value: JSON.stringify(userData) }]
        });

        res.status(200).json({ message: 'User data queued successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
