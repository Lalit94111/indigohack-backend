const amqp = require('amqplib')
require('dotenv').config()

const QUEUE_NAME = process.env.QUEUE;
const RABBITMQ_URI = process.env.RABBITMQ_URI;

let channel = null;

const connectToQueue = async () => {
    try {
        if (!channel) {
            const connection = await amqp.connect(RABBITMQ_URI);
            channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });
        }
        return channel;
    } catch (error) {
        console.error("Error connecting to the message queue:", error);
        throw error;
    }
}

const publishToQueue = async (channel, jobData) => {
    try {
        await channel.sendToQueue(
            QUEUE_NAME,
            Buffer.from(JSON.stringify(jobData)),
            {
                persistent: true,
            }
        );
        console.log("Job sent to the queue:", jobData);
    } catch (error) {
        console.error("Error publishing to the queue:", error);
        throw error;
    }
}

module.exports = {
    connectToQueue,
    publishToQueue,
};
