const { Kafka } = require('kafkajs');

// Initialize the Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // Kafka broker address
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'test-group' });

async function run() {
  // Connect to the Kafka broker
  await consumer.connect();
  console.log('Connected to Kafka');

  // Subscribe to a topic
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
  console.log('Subscribed to topic "my-topic"');

  // Run the consumer to listen for messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    },
  });
}

// Run the consumer
run().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await consumer.disconnect();
  process.exit(0);
});
