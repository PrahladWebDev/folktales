const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  folktaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folktale',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique bookmark per user and folktale
bookmarkSchema.index({ userId: 1, folktaleId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);