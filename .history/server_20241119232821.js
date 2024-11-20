const express = require('express');
const redis = require('redis');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

// Redis Client
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Kafka Producer
const { Kafka, Partitioners } = require('kafkajs');

// Kafka producer with legacy partitioner
const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

(async () => {
    await producer.connect();
})();

        // Check Redis for client status
        const clientStatus = await redisClient.get(`client_status:${clientId}`);
        if (clientStatus !== 'active') {
            return res.status(403).json({ message: 'Client not active' });
        }

        // Send data to Kafka
        const userData = req.body;
        await producer.send({
            topic: 'registration',
            messages: [{ value: JSON.stringify(userData) }]
        });

        res.status(200).json({ message: 'User data queued successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
