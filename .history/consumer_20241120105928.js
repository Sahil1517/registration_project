const { Kafka } = require('kafkajs');
const { Pool } = require('pg');

// Initialize Kafka consumer
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'registration-group' });

// Initialize PostgreSQL client
const pool = new Pool({
  user: 'your_user',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'your_database',  // Replace with your database name
  password: 'your_password',  // Replace with your PostgreSQL password
  port: 5432,
});

(async () => {
  try {
    // Connect Kafka consumer
    await consumer.connect();
    await consumer.subscribe({ topic: 'registration', fromBeginning: true });

    console.log('Kafka consumer is listening for messages...');

    // Consume messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Parse the consumed message
        const userData = JSON.parse(message.value.toString());
        console.log('Consumed message:', userData);

        // Insert the consumed data into PostgreSQL
        await pool.query(
          'INSERT INTO registration_info (name, email, mobile, city) VALUES ($1, $2, $3, $4)',
          [userData.name, userData.email, userData.mobile, userData.city]
        );
        console.log('Data inserted into PostgreSQL');
      },
    });
  } catch (err) {
    console.error('Error in Kafka consumer:', err);
  }
})();

// Graceful shutdown on process termination (CTRL+C)
process.on('SIGINT', async () => {
  console.log('Shutting down consumer...');
  await consumer.disconnect();
  await pool.end();
  process.exit(0);
});
