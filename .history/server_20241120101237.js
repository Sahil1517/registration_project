const express = require('express');
const { Client } = require('redis');  // Import Redis client for v4.x
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Create Redis client instance (v4.x)
const redisClient = new Client({
  url: 'redis://localhost:6379'  // Use the correct Redis connection URL
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

// Sample endpoint to interact with Redis
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
