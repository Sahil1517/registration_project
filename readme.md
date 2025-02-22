 Registration Project

This project is a registration system built using Node.js, Kafka, Redis, and PostgreSQL. It includes a Kafka producer-consumer setup, a Redis cache for storing data, and a PostgreSQL database for persistent storage.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Kafka Consumer](#kafka-consumer)
- [Redis Integration](#redis-integration)
- [PostgreSQL Integration](#postgresql-integration)
- [Dependencies](#dependencies)
- [License](#license)

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v12 or higher)
- Kafka (installed locally or running via Docker)
- Redis (installed locally or running via Docker)
- PostgreSQL (installed locally or via Docker)

## Installation

1. Download the ZIP file containing the project.
2. Extract the contents to a folder on your machine.

3. Install the dependencies:

   In the terminal, navigate to the project folder and run:

   ```bash
   npm install
   ```

## Setup

### Kafka

1. Make sure Kafka is running locally on `localhost:9092`. You can start Kafka using Docker, or if you have it set up locally, ensure it is running.

2. Kafka requires Zookeeper for managing distributed brokers. You can use Kafka’s bundled Zookeeper or set it up separately.

### Redis

1. Ensure Redis is running locally on `localhost:6379`. You can install Redis or use Docker to run it.

### PostgreSQL

1. Ensure PostgreSQL is running locally or through Docker.
2. The default database in the code is `registration_db`. Ensure the necessary table `registration_info` exists or is created based on your needs.

## Running the Project

1. Start your services:
   - Start Kafka and Zookeeper.
   - Start Redis.
   - Start PostgreSQL.

2. Run the server:

   ```bash
   node server.js
   ```

3. Start the Kafka consumer:

   ```bash
   node consumer.js
   ```

   This will start the consumer, which listens to Kafka topics for new messages.

4. The server will be running on `http://localhost:3000`. You can now test the API endpoints.

## API Endpoints

### 1. `/redis` (GET)

This endpoint interacts with Redis to set and retrieve a key-value pair.

Example Response:

```plaintext
Value from Redis: John Doe
```

### 2. `/register` (POST)

This endpoint registers a new user and adds the data to PostgreSQL.

Request Body Example:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

Response Example:

```json
{
  "message": "User registered successfully"
}
```

## Kafka Consumer

The `consumer.js` file listens to messages on Kafka and processes them when they arrive. It connects to the `my-topic` Kafka topic and prints the message received.

- Consumer connection details:
  - `clientId`: `my-app`
  - `groupId`: `test-group`
  - `broker`: `localhost:9092`
  - Topic: `my-topic`

## Redis Integration

The project uses Redis for caching user data. The `server.js` file connects to Redis to store and retrieve values. The `/redis` endpoint demonstrates setting a key-value pair in Redis.

### Redis Commands Used:
- `SET`: Store data in Redis.
- `GET`: Retrieve data from Redis.

## PostgreSQL Integration

The project connects to PostgreSQL using a `registration_db` database.

- The `registration_info` table holds user registration data (name, email).
- Modify the `server.js` to interact with the PostgreSQL database for additional functionality if needed.

## Dependencies

- express: Web framework for Node.js.
- redis: Redis client for Node.js.
- kafkajs: Kafka client for Node.js.
- pg: PostgreSQL client for Node.js.
- body-parser: Middleware for parsing request bodies.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This version of the `README.md` file is tailored for a project that is shared as a folder.
