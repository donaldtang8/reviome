const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  user_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  item_id: {
    type: mongoose.Schema.ObjectId
  },
  item_type: {
    type: String,
    enum: {
      values: ['Post', 'Comment', 'User'],
      message: 'Item type is either: Post, Comment, or User'
    },
    required: [true, 'Please provide an item type']
  },
  report_type: {
    type: String,
    enum: {
      values: ['Feedback', 'Spam', 'Inppropriate', 'Harmful'],
      message: 'Report type is either: feedback, spam, inppropriate, or harmful'
    },
    required: [true, 'Please provide a type']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'review', 'closed'],
      message: 'Status is either: open, review, or completed'
    },
    default: 'open'
  },
  statusMessage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  resolvedAt: {
    type: Date
  }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
