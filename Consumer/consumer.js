const amqp = require('amqplib')
const sendEmail = require('./sendMail');
const createMessage = require('./sendSMS')
require('dotenv').config()

const QUEUE_NAME = process.env.QUEUE;
const RABBITMQ_URI = process.env.RABBITMQ_URI;

let channel = null

const connectToQueue = async () => {

    try {
        if (!channel) {
            const connection = await amqp.connect(RABBITMQ_URI)
            channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true })
        }
        return channel
    } catch (error) {
        console.log("Error connecting to the message Queue", error)
        throw error
    }
}

const processJob = async (jobData) => {
    try {
        const jsonString = jobData.content.toString('utf8');
        const data = JSON.parse(jsonString);

        if (data.method === 'Email') {
            const html = `
                <h1>Flight Notification</h1>
                <p>Dear Customer,</p>
                <p>We would like to inform you about an important update regarding your flight.</p>
                <p><strong>${data.message}</strong></p>
                <p>We apologize for any inconvenience this may cause and appreciate your understanding.</p>
                <p>Thank you for your attention to this matter.</p>
                <p>Best regards,<br>FlightWatch</p>
            `;
            await sendEmail(data.recipient, "Flight Notification", html);
        } else if (data.method === 'SMS') {
            const info = data.message;
            await createMessage(info, data.recipient);
        }

        console.log("Job is Started", data);
    } catch (error) {
        console.log(error)
    }
}

const startWorker = async () => {
    try {
        console.log(QUEUE_NAME,RABBITMQ_URI)
        const channel = await connectToQueue()
        channel.consume(QUEUE_NAME, async (msg) => {
            console.log("Sending data to Process")
            await processJob(msg)
            channel.ack(msg)
        })
    } catch (error) {
        console.log("Error Starting the Worker")
        throw error
    }
}


startWorker()