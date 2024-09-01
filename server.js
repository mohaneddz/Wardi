import dotenv from 'dotenv';
import app from './app.js';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });
const connections = {};
const DATABASE_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE_URI, {
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
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}/`);
    });
}

startServer();

export { connections }; // Export connections as a named export