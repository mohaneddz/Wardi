import mongoose from 'mongoose';
import userSchema from './userSchema.js';

// Adding the Methods to the Schema ------------------------------------------

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};

userSchema.methods.createPasswordResetToken = function () {

	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// console.log({ resetToken }, this.passwordResetToken);
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

// Exporting the final Model ------------------------------------------

const User = mongoose.model('User', userSchema);

export default User;
