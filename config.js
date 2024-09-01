// config.js
import dotenv from 'dotenv';

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    throw new Error('Missing DATABASE or DATABASE_PASSWORD environment variable');
}

const dbUri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

export const databases = {
    quran: {
        uri: `${dbUri}Quran`,
    },
    hadith: {
        uri: `${dbUri}Hadith`,
    },
    tafsir: {
        uri: `${dbUri}Tafsir`,
    },
};