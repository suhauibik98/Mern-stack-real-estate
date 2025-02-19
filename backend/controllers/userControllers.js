const bcrypt = require("bcryptjs");
const { errorHandler } = require("../util/error");
const User = require("../models/User");
const Contact = require("../models/ContactMessages");
const { deleteFile } = require("../util/deleteFile");
const path = require("path");

const updateUser = async (req, res, next) => {
  const { password, new_password, username, email, avatar, phone } = req.body;

  // Check if the user is updating their own account
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    const user = await User.findById(req.params.userId).select("+password");

    // Update avatar, username, and email if provided
    if (avatar) user.avatar = avatar;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Handle password change
    if (new_password) {
      // For Google-authenticated users
      if (req.user.isGoogle) {
        // If Google user has set a password previously
        if (user.isModifiedPassword) {
          // Verify current password if provided
          if (!password) {
            return next(errorHandler("Current password is required", 400));
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return next(errorHandler("Incorrect current password", 400));
          }
        }
        // Set the new password
        user.password = new_password;
        user.isModifiedPassword = true;
      } else {
        // For regular (non-Google) users
        if (!password) {
          return next(errorHandler("Current password is required", 400));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return next(errorHandler("Incorrect current password", 400));
        }
        // Set the new password
        user.password = new_password;
      }
    }

    // Save the updated user data
    await user.save();

    user.password = undefined;
    // Exclude password from the response
    // const { password: hashedPassword, ...rest } = user._doc;
    res.status(200).json(user);
  } catch (err) {
    next(errorHandler("An error occurred while updating the user", 500));
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user?.id !== req.params.userId) {
    return next(errorHandler("You can only delete your own account", 404));
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteUserAvatar = async (req, res, next) => {
  const user = await User.findById(req.user?._id);

  try {
    if (!user) {
      return next(errorHandler("user not found ", 404));
    }

    if (!user?.avatar) {
      return next(errorHandler("User does not have an avatar", 404));
    }

    const uploadPath = path.join(__dirname, "../", user?.avatar).trim();
    await deleteFile(uploadPath);
    await user.save();
    res.status(200).json({ message: "delete successfully" });
  } catch (err) {
    console.log(err);
  }
};
const uploadUserAvatar = async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  const { avatar } = req.files;

  try {
    if (!user) {
      return next(errorHandler("User not found", 404));
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (avatar.size > MAX_FILE_SIZE) {
      return next(errorHandler("File size exceeds 2MB limit", 400));
    }

    if (user?.avatar) {
      const uploadPath = path.join(__dirname, "../", user?.avatar).trim();
      await deleteFile(uploadPath);
    }

    let imageName =
      Date.now() + "_" + avatar.name.split(" ").join("").toLowerCase();
    const uploadPath = path
      .join(__dirname, "../uploads/images/avatar", imageName)
      .trim();
    await avatar.mv(uploadPath);
    const publicUrl = `/uploads/images/avatar/${imageName}`;
    user.avatar = publicUrl;
    await user.save();
    res.status(200).json({ message: "upload successfully", publicUrl });
  } catch (error) {
    console.log(error);
  }
};

// for contactMessage
const contactMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    const newMessage = new Contact({
      name,
      email,
      phone,
      message,
    });
    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  updateUser,
  contactMessage,
  deleteUser,
  uploadUserAvatar,
  deleteUserAvatar,
};
