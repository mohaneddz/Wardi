import mongoose from 'mongoose';
import userSchema from './userSchema.js';
import bcrypt from 'bcryptjs';

// Running the Pre-Save / Pre-Find Middleware ------------------------------------------

userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();

	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, function (next) {
	// Only show the active users in the query
	// this points to the current query
	this.find({ isActive: { $ne: false } });
	next();
});

// Adding the Methods to the Schema ------------------------------------------

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	// return await bcrypt.compare(candidatePassword, userPassword); // TODO : Return the encrypted password, once real data is available
	return candidatePassword === userPassword;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

userSchema.methods.addBookmark = async function (type, object) {
	if (!this.bookmarks) this.bookmarks = {}; // Ensure it's an object if somehow missing
  
	switch (type) {
	  case 'verse':
		this.bookmarks.fav_verses = this.bookmarks.fav_verses || []; // Ensure the array exists
		this.bookmarks.fav_verses.push(object);
		break;
	  case 'chapter':
		this.bookmarks.fav_chapters = this.bookmarks.fav_chapters || [];
		this.bookmarks.fav_chapters.push(object);
		break;
	  case 'page':
		this.bookmarks.fav_pages = this.bookmarks.fav_pages || [];
		this.bookmarks.fav_pages.push(object);
		break;
	  case 'hadith':
		this.bookmarks.fav_hadiths = this.bookmarks.fav_hadiths || [];
		this.bookmarks.fav_hadiths.push(object);
		break;
	  case 'hadith_book':
		this.bookmarks.fav_books_hadiths = this.bookmarks.fav_books_hadiths || [];
		this.bookmarks.fav_books_hadiths.push(object);
		break;
	  case 'quran_book':
		this.bookmarks.fav_books_quran = this.bookmarks.fav_books_quran || [];
		this.bookmarks.fav_books_quran.push(object);
		break;
	  case 'tafsir_book':
		this.bookmarks.fav_books_tafsir = this.bookmarks.fav_books_tafsir || [];
		this.bookmarks.fav_books_tafsir.push(object);
		break;
	  default:
		throw new Error('Invalid bookmark type');
	}
  
	await this.save({ validateBeforeSave: false });
  };
  

// Exporting the final Model ------------------------------------------

const User = mongoose.model('User', userSchema);

export default User;
