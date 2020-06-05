const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  text: {
    type: String,
    required: [true, 'Text is required']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  likeCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// INDEX
commentSchema.index({ likes: 1 });
commentSchema.index({ post: 1, user: 1 });

// VIRTUAL MIDDLEWARE

// DOCUMENT MIDDLEWARE

// QUERY MIDDLEWARE
/**
 * @function
 * @description Populate user details on post
 **/
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt'
  }).populate('likes');
  next();
});

// INSTANCE/STATIC METHODS
commentSchema.methods.likedComment = function(userId) {
  const found = this.likes.filter(like => like._id.toString() === userId);
  return found.length > 0;
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
