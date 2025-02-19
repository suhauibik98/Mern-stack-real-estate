const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Listings = require("./Listing");
const fs = require("fs");
const path = require("path");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: [5, "name must be 5 charecter"],
      required: true,
      unique: true,
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
      select: false,
    },
    phone: {
      type: String,
      required: true,
      min: [10, "pass must be 10 char"],
      max: [14, "pass must be 14 char"],
    },
    avatar: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png",
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    isModifiedPassword: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wishList: {
      type: Array,
      default: [],
    },
    lastLogin: { type: Date, default: null },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  } else {
    next();
  }
});

userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    // Delete avatar file if it exists
    if (this.avatar) {
      const avatarPath = path.join(__dirname, "../", this.avatar);
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
        } catch (fileErr) {
          console.error("Error deleting avatar:", fileErr);
        }
      }
    }

    // Find user's listings
    const listings = await Listings.find({ userRef: this._id });

    // Delete images from listings
    for (const listing of listings) {
      if (listing.imageUrls?.length) {
        for (const imageUrl of listing.imageUrls) {
          const imagePath = path.join(__dirname, "../", imageUrl);
          if (fs.existsSync(imagePath)) {
            try {
              fs.unlinkSync(imagePath);
            } catch (fileErr) {
              console.error(`Error deleting image: ${imagePath}`, fileErr);
            }
          }
        }
      }
    }

    // Delete listings associated with user
    await Listings.deleteMany({ userRef: this._id });

    console.log(`User and their listings deleted successfully: ${this._id}`);
    next();
  } catch (err) {
    console.error("Error during user deletion:", err);
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password, savedPassword) {
  const isPasswordMatched = await bcrypt.compare(password, savedPassword);
  return isPasswordMatched;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
// https://www.youtube.com/watch?v=VAaUy_Moivw&t=3308s
