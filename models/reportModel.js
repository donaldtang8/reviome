const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  user_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  item_id: {
    type: mongoose.Schema.ObjectId,
  },
  item_type: {
    type: String,
    enum: {
      values: ['Post', 'Comment', 'User'],
      message: 'Item type is either: Post, Comment, or User',
    },
    required: [true, 'Please provide an item type'],
  },
  report_type: {
    type: String,
    enum: {
      values: ['Feedback', 'Spam', 'Inappropriate', 'Harmful'],
      message:
        'Report type is either: feedback, spam, inppropriate, or harmful',
    },
    required: [true, 'Please provide a type'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  link: {
    type: String,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'review', 'closed'],
      message: 'Status is either: open, review, or closed',
    },
    default: 'open',
  },
  action: {
    type: String,
    enum: {
      values: ['none', 'remove', 'temp_ban', 'perm_ban'],
    },
    default: 'none',
  },
  statusMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resolvedAt: {
    type: Date,
  },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
