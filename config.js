import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    throw new Error('Missing DATABASE or DATABASE_PASSWORD environment variable');
}

// Replace `<PASSWORD>` with the actual password in the URI
const dbUri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

export const databases = {
    quran: {
        uri: `${dbUri}Quran`, // Full URI for Quran database
    },
    hadith: {
        uri: `${dbUri}Hadith`, // Full URI for Hadith database
    },
    tafsir: {
        uri: `${dbUri}Tafsir`, // Full URI for Tafsir database
    },
};
