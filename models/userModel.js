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
	return await bcrypt.compare(candidatePassword, userPassword);
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
	if (!this.bookmarks) this.bookmarks = {};

	const addToBookmarks = (arrayName, item) => {
		this.bookmarks[arrayName] = this.bookmarks[arrayName] || [];

		// Check if item already exists in the array
		if (
			!this.bookmarks[arrayName].some(
				(existingItem) => JSON.stringify(existingItem) === JSON.stringify(item)
			)
		) {
			this.bookmarks[arrayName].push(item);
		}
	};

	switch (type) {
		case 'verse':
			addToBookmarks('fav_verses', object);
			break;
		case 'chapter':
			addToBookmarks('fav_chapters', object);
			break;
		case 'page':
			addToBookmarks('fav_pages', object);
			break;
		case 'hadith':
			addToBookmarks('fav_hadiths', object);
			break;
		case 'hadith_book':
			addToBookmarks('fav_books_hadiths', object);
			break;
		case 'quran_book':
			addToBookmarks('fav_books_quran', object);
			break;
		case 'tafsir_book':
			addToBookmarks('fav_books_tafsir', object);
			break;
		case 'hadith_section':
			addToBookmarks('fav_sections_hadith', object);
			break;
		default:
			throw new Error('Invalid bookmark type');
	}
	await this.save({ validateBeforeSave: false });
};

userSchema.methods.removeBookmark = async function (type, object) {
	// Map of bookmark types to their respective fields in the schema
	const bookmarkFields = {
		verse: 'bookmarks.fav_verses',
		chapter: 'bookmarks.fav_chapters',
		page: 'bookmarks.fav_pages',
		hadith: 'bookmarks.fav_hadiths',
		hadith_book: 'bookmarks.fav_books_hadiths',
		quran_book: 'bookmarks.fav_books_quran',
		tafsir_book: 'bookmarks.fav_books_tafsir',
		hadith_section: 'bookmarks.fav_sections_hadith',
	};

	const bookmarkField = bookmarkFields[type];

	  if (!bookmarkField) {
		throw new Error('Invalid bookmark type');
	}

	try {
		// Construct the match criteria based on the fields available in the object
		const matchCriteria = {};
		for (const key in object) {
			if (object[key] !== undefined) {
				matchCriteria[key] = object[key];
			}
		}

		// Directly use the update operation on the current user instance
		const result = await this.updateOne(
			{
				$pull: {
					[bookmarkField]: matchCriteria,
				},
			},
			{ new: true, useFindAndModify: false }
		);

		// Check if any modifications were made
		if (result.modifiedCount === 0) {
			console.log('No bookmark matched the criteria for removal.');
		} else {
			console.log(`Successfully removed ${type} bookmark matching criteria:`, matchCriteria);
		}
	} catch (error) {
		console.error('Error removing bookmark:', error);
		throw new Error('Failed to remove bookmark');
	}
};

// Exporting the final Model ------------------------------------------

const User = mongoose.model('User', userSchema);

export default User;
