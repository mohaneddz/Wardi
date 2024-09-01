import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { databases } from './config.js';

dotenv.config({ path: './config.env' });

// Database connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on http://localhost:${port}/`);
});

const connections = {};
export default connections;