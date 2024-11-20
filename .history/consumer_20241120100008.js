const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg'); // Import PostgreSQL client
const redis = require('redis');
const kafka = require('kafkajs');

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Connect to PostgreSQL
const dbClient = new Client({
  user: 'postgres',         // PostgreSQL username
  host: 'localhost',        // Database server
  database: 'registration_db',  // Your database name
  password: 'sahil123',     // Your PostgreSQL password
  port: 5432,                   // Your PostgreSQL port (default: 5432)
});

dbClient.connect()  // Connect to PostgreSQL
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.log("Error connecting to PostgreSQL", err));

// Set up Redis
const redisClient = redis.createClient();
redisClient.on('connect', function () {
  console.log('Connected to Redis');
});
redisClient.connect();

// Set up Kafka (optional, if needed)
const kafkaClient = new kafka.Kafka({
  clientId: 'kafka-producer',
  brokers: ['localhost:9092'],
});

const producer = kafkaClient.producer();

// Start Kafka producer
producer.connect()
  .then(() => console.log('Kafka Producer connected'))
  .catch(err => console.error('Error connecting Kafka Producer', err));

// Sample Route for Registration
app.post('/register', async (req, res) => {
  const { client_id, name, email } = req.body;

  if (!client_id || !name || !email) {
    return res.status(400).json({ error: 'client_id, name, and email are required' });
  }

  try {
    // Insert registration info into PostgreSQL
    const query = 'INSERT INTO registration_info(client_id, name, email) VALUES($1, $2, $3)';
    await dbClient.query(query, [client_id, name, email]);

    // Set data in Redis (optional caching layer)
    await redisClient.set(`client:${client_id}`, JSON.stringify({ name, email }));

    // Send data to Kafka topic (optional, for async processing)
    await producer.send({
      topic: 'registration-topic',
      messages: [
        { value: JSON.stringify({ client_id, name, email }) },
      ],
    });

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sample Route to check if PostgreSQL data exists
app.get('/check-registration', async (req, res) => {
  const { client_id } = req.query;

  if (!client_id) {
    return res.status(400).json({ error: 'client_id is required' });
  }

  try {
    // Fetch registration info from PostgreSQL
    const query = 'SELECT * FROM registration_info WHERE client_id = $1';
    const result = await dbClient.query(query, [client_id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    console.error("Error in /check-registration route:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
