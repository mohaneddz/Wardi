import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({ path: './config.env' });

const DATABASE_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connections = {};

async function connectDB() {
    try {
        connections.Quran = mongoose.createConnection(DATABASE_URI.replace('<DB_NAME>', 'Quran'), {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        connections.Hadith = mongoose.createConnection(DATABASE_URI.replace('<DB_NAME>', 'Hadith'), {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        connections.Tafsir = mongoose.createConnection(DATABASE_URI.replace('<DB_NAME>', 'Tafsir'), {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        connections.Users = mongoose.createConnection(DATABASE_URI.replace('<DB_NAME>', 'Users'), {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('DB connections successful');
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1); // Exit process with failure
    }
}

async function startServer() {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}/`);
    });
}

startServer();

export { connections }; // Export connections as a named export