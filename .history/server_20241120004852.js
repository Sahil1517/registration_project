const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const { Kafka } = require('kafkajs');
const { promisify } = require('util');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Redis Setup
const redisClient = redis.createClient(); // Adjust connection options if necessary
const getAsync = promisify(redisClient.get).bind(redisClient);

// Kafka Producer Setup
const kafka = new Kafka({
    clientId: 'registration-producer',
    brokers: ['localhost:9092'], // Update with your broker details
});

const producer = kafka.producer();

// Connect Kafka Producer
(async () => {
    try {
        await producer.connect();
        console.log('Kafka producer connected');
    } catch (error) {
        console.error('Failed to connect Kafka producer:', error);
    }
})();

// Registration Endpoint
app.post('/register', async (req, res) => {
    const clientId = req.headers['client_id'];
    const { name, email, mobile, city } = req.body;

    // Validate Inputs
    if (!clientId) return res.status(400).json({ error: 'client_id is required' });
    if (!name || !email || !mobile || !city) {
        return res.status(400).json({ error: 'All fields (name, email, mobile, city) are required' });
    }

    try {
        // Check Client Status in Redis
        const clientStatus = await getAsync(`client_status:${clientId}`);
        if (clientStatus !== 'active') {
            return res.status(400).json({ error: 'Client is not active' });
        }

        // Send Data to Kafka
        await producer.send({
            topic: 'registration',
            messages: [{ value: JSON.stringify({ name, email, mobile, city }) }],
        });

        return res.status(200).json({ message: 'Registration data sent to Kafka' });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
