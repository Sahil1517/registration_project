const express = require('express');
const redis = require('redis');
const { Kafka, Partitioners } = require('kafkajs');

const app = express();
app.use(express.json());

// Redis client
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Kafka producer
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

(async () => {
    await producer.connect();
    console.log('Kafka producer connected');
})();

// Registration API
app.post('/register', async (req, res) => {
    try {
        const clientId = req.header('Client_id');
        if (!clientId) {
            return res.status(400).json({ error: 'Client_id is required' });
        }

        // Get client status from Redis
        const clientStatus = await redisClient.get(`client_status:${clientId}`);
        if (clientStatus !== 'active') {
            return res.status(403).json({ message: 'Client not active' });
        }

        // Send user data to Kafka topic
        const userData = req.body;
        await producer.send({
            topic: 'registration',
            messages: [{ value: JSON.stringify(userData) }],
        });

        res.status(200).json({ message: 'User data queued successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
