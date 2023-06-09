const Category = require("../models/categoryModel");
const factory = require("./handlerFactor");

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.createCategory = factory.creatOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deletOne(Category);
