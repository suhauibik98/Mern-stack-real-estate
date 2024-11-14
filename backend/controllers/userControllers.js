const bcrypt = require("bcryptjs");
const { errorHandler } = require("../util/error");
const User = require("../models/User");

const updateUser = async (req, res, next) => {
  const { password, new_password, username, email, avatar } = req.body;

  // Check if the user is updating their own account
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    const user = await User.findById(req.params.id).select("+password");

    // Update avatar, username, and email if provided
    if (avatar) user.avatar = avatar;
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle password change
    if (new_password) {
      // For Google-authenticated users
      if (req.user.isGoogle) {
        // If Google user has set a password previously
        if (user.isModifiedPassword) {
          // Verify current password if provided
          if (!password) {
            return next(errorHandler(400, "Current password is required"));
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return next(errorHandler(400, "Incorrect current password"));
          }
        }
        // Set the new password
        user.password = new_password;
        user.isModifiedPassword = true;
      } else {
        // For regular (non-Google) users
        if (!password) {
          return next(errorHandler(400, "Current password is required"));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return next(errorHandler(400, "Incorrect current password"));
        }
        // Set the new password
        user.password = new_password;
      }
    }

    // Save the updated user data
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
