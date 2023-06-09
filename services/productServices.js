const Product = require("../models/productModel");
const factory = require("./handlerFactor");

exports.getProducts = factory.getAll(Product, "Products");

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.creatOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deletOne(Product);
