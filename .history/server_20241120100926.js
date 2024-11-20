// Import required modules
const express = require('express');
const redis = require('redis');
const pg = require('pg'); // Postgres client

const app = express();
const port = 3000;

// Connect to PostgreSQL
const pool = new pg.Pool({
  user: 'postgres', // your postgres username
  host: 'localhost',
  database: 'registration_db', // your database name
  password: 'sahil123', // your postgres password
  port: 5432, // default port for PostgreSQL
});

// Connect to Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' // Redis server URL
});

redisClient.connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(err => {
    console.error("Error connecting to Redis:", err);
  });

// Routes

// A simple route to fetch data from PostgreSQL and Redis
app.get('/', (req, res) => {
  // First, let's fetch a value from Redis
  redisClient.get('name')
    .then((name) => {
      if (name) {
        // If the data exists in Redis, return it
        return res.send(`Hello from Redis: ${name}`);
      } else {
        // If no data in Redis, fetch from PostgreSQL and then store it in Redis
        pool.query('SELECT * FROM registration_info LIMIT 1', (err, result) => {
          if (err) {
            console.error('Error fetching from PostgreSQL:', err);
            return res.status(500).send('Error fetching data');
          }

          const dbData = result.rows[0];
          // Store the fetched data in Redis for future use
          redisClient.set('name', dbData.name)
            .then(() => {
              res.send(`Data from PostgreSQL and saved to Redis: ${dbData.name}`);
            })
            .catch(err => {
              console.error('Error saving to Redis:', err);
              res.status(500).send('Error saving to Redis');
            });
        });
      }
    })
    .catch(err => {
      console.error('Error interacting with Redis:', err);
      res.status(500).send('Error interacting with Redis');
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
