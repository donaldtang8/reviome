const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  user_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  primary_id: {
    type: mongoose.Schema.ObjectId,
  },
  secondary_id: {
    type: mongoose.Schema.ObjectId,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

/* INDEX */
notificationSchema.index({ user_to: 1 });

/* VIRTUALS */

/* DOCUMENT MIDDLEWARE */

/* QUERY MIDDLEWARE */
/**
 * @function
 * @description Populate user details on notification
 **/
notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user_from',
    select: '-__v -passwordChangedAt',
  }).populate({
    path: 'user_to',
    select: '-__v -passwordChangedAt',
  });
  next();
});

/* INSTANCE/STATIC METHODS */

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
