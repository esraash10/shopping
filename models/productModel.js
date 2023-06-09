const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "too short product title"],
      maxLength: [100, "too long product title"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minLength: [20, "too short product title"],
    },
    quantity: {
      type: Number,
      required: [true, "product description is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product description is required"],
      trim: true,
      max: [2000, "too long product price "],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image Cover is required"],
    },
    image: [String],
    Category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to Category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    retingAvarage: {
      type: Number,
      min: [1, "Rating  must be above or equal 1.0"],
      max: [5, "Rating  must be below or equal 5.0"],
    },
    retingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "Category",
    select: "name",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
