const { Kafka } = require('kafkajs');

// Create a new Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],  // Kafka broker address (change if necessary)
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'test-group' });

async function run() {
  try {
    // Connect to Kafka
    await consumer.connect();
    console.log('Connected to Kafka');

    // Subscribe to the topic 'my-topic'
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
    console.log('Subscribed to topic "my-topic"');

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // This is where you process each message from Kafka
        console.log(`Received message from ${topic}[${partition}] at offset ${message.offset}`);
        console.log('Message value:', message.value.toString());
      },
    });

  } catch (error) {
    console.error('Error in consumer:', error);
  }
}

// Start the consumer
run().catch(console.error);

// Graceful shutdown on process termination (CTRL+C)
process.on('SIGINT', async () => {
  console.log('Shutting down consumer...');
  await consumer.disconnect();
  process.exit(0);
});
