const redis = require('redis');
const { Kafka } = require('kafkajs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Redis client (v4.x)
const redisClient = redis.createClient();

// Kafka producer setup
const kafka = new Kafka({
    clientId: 'registration-producer',
    brokers: ['localhost:9092'],
});
const producer = kafka.producer();

// POST /register endpoint
app.post('/register', async (req, res) => {
    const clientId = req.headers['client_id'] || req.query.client_id;
    if (!clientId) {
        return res.status(400).json({ error: 'client_id is required' });
    }

    const { name, email, mobile, city } = req.body;

    try {
        // Check client status in Redis
        // Check client status in Redis
const clientStatus = await getAsync(`client_status:${clientId}`);
console.log(`Client Status for ${clientId}: ${clientStatus}`); // Debug log
if (clientStatus !== 'active') {
    return res.status(400).json({ error: 'Client is not active' });
}


        // Send data to Kafka if client is active
        await producer.send({
            topic: 'registration',
            messages: [{ value: JSON.stringify({ name, email, mobile, city }) }],
        });

        return res.status(200).json({ message: 'Registration data sent to Kafka' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
