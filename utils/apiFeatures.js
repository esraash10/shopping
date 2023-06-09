// eslint-disable-next-line no-unused-vars
const { countDocuments } = require("../models/productModel");

class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.Keyword) {
      let query = {};
      // eslint-disable-next-line eqeqeq
      if (modelName == "Product") {
        query.$or = [
          { title: { $regex: this.queryString.Keyword, $options: "i" } },
          { description: { $regex: this.queryString.Keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.Keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  // eslint-disable-next-line no-shadow
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const Pagination = {};
    Pagination.currentPage = page;
    Pagination.limit = limit;
    Pagination.numberofPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      Pagination.next = page + 1;
    }

    if (skip > 0) {
      Pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.PaginationResults = Pagination;
    return this;
  }
}

module.exports = ApiFeatures;
