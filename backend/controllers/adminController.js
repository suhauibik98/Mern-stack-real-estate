const Listings = require("../models/Listing");
const Contact = require("../models/ContactMessages");
const User = require("../models/User");
const mongoose = require("mongoose");
const { errorHandler } = require("../util/error");
const path = require("path");
const fs = require("fs");
const { deleteFile } = require("../util/deleteFile");
const Joi = require("joi");

const getAllUser = async (req, res) => {
  const { page = 1 } = req.query; // Default page to 1 if not provided
  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  try {
    const Total_users = await User.countDocuments(); // Total count of users
    const All_users = await User.find().skip(skip).limit(limit);
    // .populate("listings", "title price image")

    if (All_users.length === 0) {
      return res.status(404).json({ message: "No User found" });
    }

    res.status(200).json({
      Total_users,
      All_users,
      page,
      totalPage: Math.ceil(Total_users / limit),
    });

    // const users = await User.find();
    // res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllListingsForAdmin = async (req, res) => {
  const { page = 1 } = req.query; // Default page to 1 if not provided
  const limit = 4;
  const skip = (Number(page) - 1) * limit;

  try {
    const Total_listings = await Listings.countDocuments(); // Total count of listings
    const All_listings = await Listings.find()
      .skip(skip)
      .limit(limit)
      .populate("userRef", "email avatar username"); // Populate user reference fields

    // Validate the results
    if (All_listings.length === 0) {
      return res.status(404).json({ message: "No listings found" });
    }

    res.status(200).json({
      listings: All_listings,
      total: Total_listings,
      page: Number(page),
      totalPage: Math.ceil(Total_listings / limit), // Total number of pages
    });
  } catch (err) {
    console.error("Error fetching listings:", err); // Log errors
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

const getAllUserCount = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    console.log(usersCount);

    res.status(200).json(usersCount);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllListingsCount = async (req, res) => {
  try {
    const listingsCount = await Listings.countDocuments();

    res.status(200).json(listingsCount);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST /users
// Create a new user

const createUser = async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const SchemaUser = Joi.object({
      username: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must have at least 3 characters",
        "string.max": "Name cannot exceed 30 characters",
        "any.required": "Name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string()
        .min(8)
        .max(50)
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          "string.empty": "Password is required",
          "string.min": "Password must have at least 8 characters",
          "string.max": "Password cannot exceed 50 characters",
          "string.pattern.base":
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
          "any.required": "Password is required",
        }),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          "string.empty": "Phone is required",
          "string.pattern.base": "Phone number must be 10 digits",
        }),
    });
    const { error } = SchemaUser.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Invalid request",
        details: error.details[0].message,
      });
    }

    const newUser = new User({ username, email, password, phone });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

    // const newUser = await User.create(req.body);
    // res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /users/:id
// Get a user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
// PUT /users/:id
// Update a user by id

const updateUser = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Validate request body
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "Update data is required" });
    }

    // Find the user by ID
    const user = await User.findById(req.params.userId).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields except for the password
    Object.keys(req.body).forEach((key) => {
      if (key !== "password") {
        user[key] = req.body[key];
      }
    });

    // Handle password update separately
    if (req.body.password) {
      user.password = req.body.password; // This triggers the `pre("save")` hook
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Exclude the password from the response
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user.isAdmin) {
      user.isAdmin = false;
    } else {
      user.isAdmin = true;
    }
    await user.save();
    res.status(200).json({ user, msg: "User role has been changed" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const blockedUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user.isBlocked) {
      user.isBlocked = false;
    } else {
      user.isBlocked = true;
    }
    await user.save();
    res.status(200).json("User has been blocked");
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUserListingsAdmin = async (req, res, next) => {
  const { userId } = req.params;
  const { page } = req.query;
  const limit = 6;
  const skip = (page - 1) * limit;
  try {
    const totalListing = await Listings.countDocuments({ userRef: userId });

    const listings = await Listings.find({ userRef: userId })
      .limit(limit)
      .skip(skip)
      .populate("userRef", "email avatar username");
    res.status(200).json({
      listings,
      page,
      totalPage: Math.ceil(totalListing / limit),
      totalListing,
    });
  } catch (error) {
    next(errorHandler("not found", 404));
  }
};

const deleteUserListingsAdmin = async (req, res, next) => {
  const { Listings_id } = req.params;

  try {
    if (!Listings_id) {
      return next(errorHandler("Invalid listing ID", 400));
    }

    const listing = await Listings.findById(Listings_id);
    if (!listing) {
      return next(errorHandler("Listing not found", 404));
    }

    if (listing.imageUrls && Array.isArray(listing.imageUrls)) {
      const imageDeletionPromises = listing.imageUrls.map((imageUrl) => {
        const filePath = path.join(__dirname, "../", imageUrl);
        return deleteFile(filePath);
      });

      await Promise.all(imageDeletionPromises);
    }

    await Listings.findByIdAndDelete(Listings_id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Error deleting listing:", err.message);
    next(errorHandler(err.message || "Internal Server Error", 500));
  }
};

const deleteUserAndHisListingsByAdmin = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    // Ensure admin is authenticated
    if (!req.user || !req.user._id) {
      return next(
        errorHandler("Unauthorized: Admin authentication required", 401)
      );
    }

    // Find the user to be deleted
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler("User not found", 404));
    }

    // Fetch the admin with password field
    const admin = await User.findById(req.user._id).select("+password");
    if (!admin) {
      return next(errorHandler("Admin not found", 404));
    }

    // Ensure the requester is an admin
    if (!admin.isAdmin) {
      return next(errorHandler("Forbidden: Only admins can delete users", 403));
    }

    // Validate password
    const isValidPassword = await admin.comparePassword(
      password,
      admin.password
    );
    if (!isValidPassword) {
      return next(errorHandler("Invalid password", 401));
    }

    // Delete the user & trigger schema pre-hooks

    // await user.deleteOne();

    res
      .status(200)
      .json({ message: "User and their listings deleted successfully" });
  } catch (err) {
    console.error("Error deleting user and their listings:", err);
    next(errorHandler(err.message || "Internal Server Error", 500));
  }
};

const getMessegesFromDB = async (req, res, next) => {
  try {
    const messges = await Contact.find();

    res.status(200).json(messges);
  } catch (err) {
    next(errorHandler(err.message || "Internal Server Error", 500));
  }
};

module.exports = {
  getAllUser,
  createUser,
  getUserById,
  updateUser,
  changeUserRole,
  blockedUser,
  getUserListingsAdmin,
  deleteUserListingsAdmin,
  getAllListingsCount,
  getAllListingsForAdmin,
  getAllUserCount,
  deleteUserAndHisListingsByAdmin,
  getMessegesFromDB,
};
