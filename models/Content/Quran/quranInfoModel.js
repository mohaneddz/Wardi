import mongoose from 'mongoose'; // Import the mongoose instance

const quranInfoSchema = new mongoose.Schema({
  verses: {
    type: Number,
    required: true,
  },
  chapters: [{
    type: Array,
    required: true,
  }],
}, {
  toJSON: { 
    transform: (doc, ret) => { 
      delete ret._id; 
      delete ret.__v; 
      return { verses: ret.verses, chapters: ret.chapters };
    } 
  },
  toObject: { 
    transform: (doc, ret) => { 
      delete ret._id; 
      delete ret.__v; 
      return { verses: ret.verses, chapters: ret.chapters };
    } 
  }
});

const Info = mongoose.model('infos', quranInfoSchema);

export default Info;