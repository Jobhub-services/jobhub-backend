import amqp from 'amqplib';
async function connectToAMQP() {
	const amqpServer = process.env.RABBITMQ_URL;
	const connection = await amqp.connect(amqpServer);
	const channel = await connection.createChannel();
	return channel;
}

export { connectToAMQP };
