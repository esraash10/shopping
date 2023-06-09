const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// eslint-disable-next-line no-shadow
exports.deletOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

// eslint-disable-next-line no-shadow
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

// eslint-disable-next-line no-shadow
exports.creatOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newdocument = await Model.create(req.body);
    res.status(201).json({ data: newdocument });
  });

// eslint-disable-next-line no-shadow
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Document = await Model.findById(id);
    if (!Document) {
      return next(new ApiError(`No Document for this id ${id}`, 404));
    }
    res.status(200).json({ data: Document });
  });

// eslint-disable-next-line no-shadow
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
    const { mongooseQuery, PaginationResults } = apiFeatures;
    const Documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: Documents.length, PaginationResults, data: Documents });
  });
