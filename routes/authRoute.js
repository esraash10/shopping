const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const { singup, login } = require("../services/authServices");

const router = express.Router();

router.route("/signup").post(signupValidator, singup);

router.route("/login").post(loginValidator, login);
module.exports = router;

// hello esraa
