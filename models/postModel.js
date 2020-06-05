const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
    },
    link: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid URL'],
      required: [true, 'Link is required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
    },
    saves: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    saveCount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEX
postSchema.index({ createdAt: 1, user: 1 });
postSchema.index({ createdAt: 1, likeCount: 1 });
postSchema.index({ category: 1 });

// VIRTUAL MIDDLEWARE
/**
 * @function
 * @description Virtually populate all comments of post
 **/
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE

// QUERY MIDDLEWARE
/**
 * @function
 * @description Populate user details on post
 **/
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt',
  })
    .populate('category')
    .populate('likes')
    .populate('saves');
  next();
});

/**
 * @function
 * @description Only query active=true posts
 * @this Current query
 **/
postSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// INSTANCE/STATIC METHODS
postSchema.methods.likedPost = function (userId) {
  const found = this.likes.filter((like) => like._id.toString() === userId);
  return found.length > 0;
};

postSchema.methods.savedPost = function (userId) {
  const found = this.saves.filter((save) => save._id.toString() === userId);
  return found.length > 0;
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
