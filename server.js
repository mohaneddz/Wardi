import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({ path: './config.env' });

const DATABASE_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
	serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  dbName: 'Content',
})
	.then(() => {
		console.log('DB connection successful');
	})
	.catch((err) => {
		console.error('DB connection error:', err);
	});

async function startServer() {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}/`);
    });
}

startServer();

export { connections }; // Export connections as a named export