const express = require('express');
const { createClient } = require('redis'); // For Redis client
const { Kafka } = require('kafkajs'); // For Kafka integration
const bodyParser = require('body-parser'); // For parsing JSON bodies

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize Redis client using the createClient method
const redisClient = createClient({
  url: 'redis://localhost:6379',  // Correct URL for Redis connection
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

// Initialize Kafka producer
const kafka = new Kafka({
  brokers: ['localhost:9092'],  // Kafka broker address
});
const producer = kafka.producer();

// Connect to Kafka producer
(async () => {
  await producer.connect(); // Connect Kafka producer
  console.log('Connected to Kafka');
})();

// Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const clientId = req.header('Client_id');
    if (!clientId) {
      return res.status(400).json({ error: 'Client_id is required' });
    }

    // Fetch client status from Redis
    const clientStatus = await redisClient.get(`client_status:${clientId}`);
    if (clientStatus !== 'active') {
      return res.status(403).json({ message: 'Client not active' });
    }

    // If active, send the request body to Kafka
    const userData = req.body;
    await producer.send({
      topic: 'registration',  // Kafka topic
      messages: [
        {
          value: JSON.stringify(userData),
        },
      ],
    });

    res.status(200).json({ message: 'User data queued successfully' });
  } catch (err) {
    console.error('Error handling /register:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sample endpoint to interact with Redis (GET /redis)
app.get('/redis', async (req, res) => {
  try {
    // Example: Set a key in Redis
    await redisClient.set('name', 'John Doe');
    
    // Get the key from Redis
    const value = await redisClient.get('name');
    res.send(`Value from Redis: ${value}`);
  } catch (err) {
    res.status(500).send('Error interacting with Redis');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
