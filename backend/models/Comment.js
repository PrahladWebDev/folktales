const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  folktaleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folktale', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);