/**
 * @class
 * @description Class that modifies a query based on the URL query parameters in the query string
 * @param query Query to be executed (.find, .findAndUpdate, ...etc)
 * @param queryString Actual URL queries (sort, page, limit, field)
 * @this Binded APIFeature that we can chain other methods to
 **/
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * @function  filter
   * @description Check query string for any filter objects (likeCount = 0, etc...) and removes any filters that we already have functions to take care of (sort, fields, limit)
   * @this  Binded APIFeature that we can chain other methods to
   **/
  filter() {
    // create a deep copy of the query string
    const queryObj = { ...this.queryString };
    // we exclude these fields because sort(), limitField(), and paginate() will take care of these fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // handle filter by time range
    if (queryObj.range) {
      let days = 0;
      if (queryObj.range === 'daily') {
        days = 1;
      } else if (queryObj.range === 'weekly') {
        days = 7;
      } else if (queryObj.range === 'monthly') {
        days = 30;
      } else if (queryObj.range === 'yearly') {
        days = 360;
      }
      // if days is not 0, that maens a valid range was picked
      if (days !== 0) {
        let time = new Date(new Date() - days * 60 * 60 * 24 * 1000);
        let newTimeObj = {
          gt: time,
        };
        queryObj.createdAt = newTimeObj;
      }

      delete queryObj['range'];
    }

    // we stringify the query string to manipulate it
    let queryStr = JSON.stringify(queryObj);
    // \b makes sure we match the exact string for all query objects (gte, gt, lte, lt)
    // callback accepts the matched string, and we will return a '$' in front of the matched string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // we then place the filter object in the query
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * @function  sort
   * @description Check query string for any sort parameters and apply the sort parameters to query
   * @this  Binded APIFeature that we can chain other methods to
   **/
  sort() {
    // check if there are sort params
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // by default, we sort by createdAt
    else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * @function  limitFields
   * @description Check query string for any field parameters and apply the field parameters to query
   * @this  Binded APIFeature that we can chain other methods to
   **/
  limitFields() {
    // check if there are fields params
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    // by default, we exclude v field
    else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * @function  paginate
   * @description Check query string for any page parameters and apply the page parameters to query
   * @this  Binded APIFeature that we can chain other methods to
   **/
  paginate() {
    // check if there is a page param - if not, by default we use 1
    const page = this.queryString.page * 1 || 1; // convert page query to num
    // check if there is a page limit - if not, by default we use 20
    const limit = this.queryString.limit * 1 || 5; // convert limit to num
    // skip represents how many elements we skip based on the page number given
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // check if request is being made to page that does not exist
    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }
    return this;
  }
}

module.exports = APIFeatures;
