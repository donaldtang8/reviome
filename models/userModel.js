const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      maxlength: [15, 'Please enter your first name under 15 characters long.'],
      required: [true, 'First name is required'],
    },
    lName: {
      type: String,
      maxlength: [15, 'Please enter your last name under 15 characters long.'],
      required: [true, 'Last name is required'],
    },
    uName: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    photo: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/reviewio.appspot.com/o/images%2Fdefault.jpg?alt=media&token=49cf666c-8aad-4158-b9d7-8b3d84ed2f06',
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'creator', 'admin'],
        message: 'Role is either: user or creator',
      },
      default: 'user',
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    block_from: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    block_to: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    categories_following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
      },
    ],
    community: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
    links: {
      youtube: {
        type: String,
      },
      instagram: {
        type: String,
      },
      soundcloud: {
        type: String,
      },
      spotify: {
        type: String,
      },
      twitch: {
        type: String,
      },
    },
    pass: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    passConfirm: {
      type: String,
      required: [true, 'Please provide a password'],
      validate: {
        // 'this' only works on create and save because password object will not refer to updated password if not saved
        validator: function (el) {
          return el === this.pass;
        },
        message: 'Passwords do not match',
      },
    },
    passChangedAt: Date,
    passResetToken: String,
    passResetExpires: Date,
    banExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* INDEX */
userSchema.index({ uName: 1 });

/* VIRTUALS */
/**
 * @function  Virtual fullName Getter
 * @description
 **/
userSchema.virtual('fullName').get(function () {
  return this.fName + ' ' + this.lName;
});

/**
 * @function
 * @description Virtually populate this user with his/her posts
 **/
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id',
});

/* DOCUMENT MIDDLEWARE */
/**
 * @function
 * @description Automatically hash passwords if password is being created or modified
 * @this Current document being created or modified
 **/
userSchema.pre('save', async function (next) {
  // only run this function if password was modified
  if (!this.isModified('pass')) return next();
  // encrypt this password with a "cost" - salt of 12
  this.pass = await bcrypt.hash(this.pass, 12);
  // no need to persist passwordConfirm to database
  this.passConfirm = undefined;
  next();
});

/**
 * @function
 * @description Set passwordChangedAt time if password is being modified
 * @this Current document being created or modified
 **/
userSchema.pre('save', function (next) {
  // only run this function if password was modified
  if (!this.isModified('pass') || this.isNew) return next();
  // update passwordChangedAt
  this.passChangedAt = Date.now() - 1000;
  next();
});

/* QUERY MIDDLEWARE */
// /**
//  * @function
//  * @description Only query active=true users
//  * @this Current query
//  **/
// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

/**
 * @function
 * @description Populate followers and following
 * @this Current query
 **/
userSchema.pre(/^find/, function () {
  this.populate({
    path: 'following',
    select: '-__v -passChangedAt -role -email',
  });
});

/* INSTANCE/STATIC METHODS */
/**
 * @function correctPassword
 * @description Checks if candidatePassword is correct
 * @param candidatePassword - Password submitted
 * @param userPassword - Password of user
 * @return True if password correct, false otherwise
 **/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * @function changedPasswordAfter
 * @description Check if token was created before new password change
 * @param JWTTimestamp Timestamp of when JWT was created (milliseconds)
 * @return True if password changed after token issued, false otherwise
 **/
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  let changedTimestamp;
  if (this.passChangedAt) {
    // convert date object to time in milliseconds
    changedTimestamp = parseInt(this.passChangedAt.getTime() / 1000, 10);
  }
  // if password was changed after token expiration, return true
  return JWTTimestamp < changedTimestamp;
};

/**
 * @function createPasswordResetToken
 * @description Create a password reset token
 * @return Reset Token
 **/
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // save the encrypted version of the reset token in the database
  this.passResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // set password reset token expires time (in milliseconds)
  this.passResetExpires = Date.now() + 60 * 1000 * 10; // add 10 minutes

  return resetToken;
};

/**
 * @function isFollowingUser
 * @description Checks if user is already being followed
 * @return True if already following, false if not followed yet
 **/
userSchema.methods.isFollowingUser = function (userId) {
  return this.following.some((user) => user.id === userId);
};

/**
 * @function isBlockingUser
 * @description Checks if user is already being blocked
 * @return True if already blocking, false if not blocked yet
 **/
userSchema.methods.isBlockingUser = function (userId) {
  return this.block_to.some((user) => user.toString() === userId);
};

/**
 * @function isFollowingCategory
 * @description Checks if category is already being followed
 * @return True if already following, false if not followed yet
 **/
userSchema.methods.isFollowingCategory = function (categoryId) {
  return this.categories_following.some(
    (cat) => String(cat._id) === categoryId
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
