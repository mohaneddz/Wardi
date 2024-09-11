import mongoose from 'mongoose';
import { TafsirSchema } from '../schemas/TafsirSchema.js';

const Tafsir = mongoose.model('Tafsir.Books', TafsirSchema);
export const TafsirSearch = mongoose.model('Tafsir.Books', TafsirSchema);

export default Tafsir;