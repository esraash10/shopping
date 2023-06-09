const Brand = require("../models/brandModel");
const factory = require("./handlerFactor");

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.createBrand = factory.creatOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deletOne(Brand);
