const bcrypt = require("bcryptjs");
const { errorHandler } = require("../util/error");
const User = require("../models/User");

const updateUser = async (req, res, next) => {
  const { prevPassword, password, new_password, username, email, avatar } =
    req.body;
  console.log(req.body);

  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    const user = await User.findById(req.params.id).select("+password");

    // Verify current password for non-Google users

    if (!req.user.isGoogle) {
      if (!password) {
        return next(errorHandler(400, "Previous password is required"));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);

      if (!isMatch) {
        return next(errorHandler(400, "Incorrect current password"));
      }
    }

    // Update the user
    user.password = new_password;

    await user.save();

    // Exclude password from the response
    const { password: hashedPassword, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(errorHandler(500, "An error occurred while updating the user"));
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(404, "You can only delete your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateUser, deleteUser };
