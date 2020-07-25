class ApiFeatures {
  // query is the mongoose query for a particular api feature
  // query string are the parameters passed with api request
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //this class will contain all the features as functions
  // Sorting
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    }
    //return the this object so that it can be used to call sort( );
    return this;
  }

  // Field Limiting

  fieldLimit() {
    // this problem with this method is if the fields
    // are not a part of mongoose model
    // it will return only ids
    if (this.queryString.fields) {
      //this will create a string for selecting fields
      // let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(
        `${this.queryString.fields.split(",").join(" ")}`
      );
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    //data and numbers are received as string. so convert it to number by
    // multiplying the value with 1
    if (this.queryString.skip) {
      this.query = this.query.skip(this.queryString.skip * 1);
    }
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit * 1);
    }
    return this;
  }
}

module.exports = ApiFeatures;
