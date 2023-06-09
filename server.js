const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");
const morgan = require("morgan");
const hpp = require("hpp");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const SubCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const authRoute = require("./routes/authRoute");

dbConnection();
const app = express();
app.use(express.json({ limit: "20kb" }));

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(mongoSanitize());
app.use(xss());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message:
//     "Too many accounts created from this IP, please try again after an hour",
// });

//app.use("/api", limiter);

app.use(hpp({ whitelist: ["price", "sold"] }));

app.use("/api/v1/categories", categoryRoute);

app.use("/api/v1/SubCategories", SubCategoryRoute);

app.use("/api/v1/products", productRoute);

app.use("/api/v1/Brands", brandRoute);

app.use("/api/v1/Users", userRoute);

app.use("/api/v1/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl} `, 400));
});
app.use(globalError);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejectio Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down........");
    process.exit(1);
  });
});

app.get("/", (req, res) => {
  res.send("our Api v1");
});
