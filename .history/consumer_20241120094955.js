const { Kafka } = require('kafkajs');
const { Pool } = require('pg');

// Kafka consumer
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'registration-group' });

// PostgreSQL client
const pool = new Pool({
    user: 'psql (17.0)', // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'registration_db', // Replace with your database name
    password: 'sahil123', // Replace with your PostgreSQL password
    port: 5432,
});

// Kafka consumer logic
(async () => {
    await consumer.connect();
    console.log('Kafka consumer connected');
    
    await consumer.subscribe({ topic: 'registration', fromBeginning: true });
    console.log('Subscribed to Kafka topic: registration');

    await consumer.run({
        eachMessage: async ({ message }) => {
            const userData = JSON.parse(message.value.toString());
            console.log('Received message:', userData);

            try {
                // Insert user data into PostgreSQL
                await pool.query(
                    'INSERT INTO registration_info (name, email, mobile, city) VALUES ($1, $2, $3, $4)',
                    [userData.name, userData.email, userData.mobile, userData.city]
                );
                console.log('Data inserted into PostgreSQL:', userData);
            } catch (error) {
                console.error('Database insertion error:', error);
            }
        },
    });
})();
