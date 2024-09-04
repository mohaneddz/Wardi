import mongoose from 'mongoose';
import userSchema from './userSchema.js';

const User = mongoose.model('User', userSchema);

export default User;