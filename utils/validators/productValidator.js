// eslint-disable-next-line no-unused-vars
const { check, Result, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("product require")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is require")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is require")
    .isNumeric()
    .withMessage("product quantity is be number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity is be number"),
  check("price")
    .notEmpty()
    .withMessage("product price is require")
    .isNumeric()
    .withMessage("product price is be number")
    .isLength({ max: 32 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount is be number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price ");
      }
      return true;
    }),
  check("Colors")
    .optional()
    .isArray()
    .withMessage("Colors should  be array of string"),
  check("imageCover").notEmpty().withMessage("product imageCover is require"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array to string"),
  check("Category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((CategoryId) =>
      Category.findById(CategoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id :${CategoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subcategoryIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoryIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoryIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.Category }).then(
        (SubCategories) => {
          // console.log(SubCategoris);
          const subCategoriesIdsDB = [];
          SubCategories.forEach((subCategory) => {
            subCategoriesIdsDB.push(subCategory._id.toString());
          });
          const checker = (target, err) => target.every((v) => err.includes(v));
          if (!checker(val, subCategoriesIdsDB)) {
            return Promise.reject(
              new Error(`subcategories no belongs to this categoryIds`)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
