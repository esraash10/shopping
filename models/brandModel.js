const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Brand require"],
      unique: [true, "Brand must be unique "],
      minlength: [3, "too short Brand name "],
      maxlength: [23, "too long Brand name "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
