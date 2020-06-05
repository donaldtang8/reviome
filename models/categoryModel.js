const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    lowercase: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null,
  },
  parentString: {
    type: String,
  },
  ancestors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  ],
  genre: {
    type: Boolean,
    default: false,
  },
});

/* INDEX */
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ name: 1, genre: 1 });

/* VIRTUALS */

/* DOCUMENT MIDDLEWARE */
/**
 * @function
 * @description Set slug of category based on name
 **/
categorySchema.pre('save', async function (next) {
  let slugString = '';
  if (this.parentString) {
    parent = await this.constructor.findOne({
      name: this.parentString,
      genre: false,
    });
    slugString = parent.slug + '/';
  }
  this.slug = slugString + slugify(this.name, { lower: true });
  next();
});

/* QUERY MIDDLEWARE */
/**
 * @function
 * @description Populate parent and ancestor details of category
 **/
categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'parent',
    select: '-__v',
  }).populate({
    path: 'ancestors',
    select: '-__v -ancestors',
  });
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
