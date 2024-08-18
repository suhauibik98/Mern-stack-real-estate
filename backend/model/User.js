const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: [5, "name must be 5 charecter"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      min: [8, "pass must be 8 char"],
      max: [16, "max pass is 16 char"],
      required: true,
    },
  },
  { timeseries: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
