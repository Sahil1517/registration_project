const express = require('express');
const { createClient } = require('redis');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

// Create an Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Create Redis client instance using `createClient`
const redisClient = createClient({
  url: 'redis://localhost:6379'  // Correct URL for Redis connection
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

// Initialize Kafka producer
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

(async () => {
  await producer.connect(); // Connect Kafka producer
})();

// Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const clientId = req.header('Client_id');
    if (!clientId) return res.status(400).json({ error: 'Client_id is required' });

    // Fetch client status from Redis
    const clientStatus = await redisClient.get(`client_status:${clientId}`);
    if (clientStatus !== 'active') {
      return res.status(403).json({ message: 'Client not active' });
    }

    // If active, send the request body to Kafka
    const userData = req.body;
    await producer.send({
      topic: 'registration',
      messages: [{ value: JSON.stringify(userData) }]
    });

    res.status(200).json({ message: 'User data queued successfully' });
  } catch (err) {
    console.error('Error handling /register:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
