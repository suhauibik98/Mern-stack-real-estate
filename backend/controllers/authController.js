const User = require("../models/User");
const { errorHandler } = require("../util/error");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const signup = async (req, res, next) => {
  const { username, email, password ,phone} = req.body;

  const userSchema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().min(10).required(),
  });

  try {
    // Validate request body
   const {error} = await userSchema.validateAsync(req.body);
    if (error) {
      return next(errorHandler("Validation Error: " + error.details[0].message, 400));
    }


    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler("User already exists", 409));
    }

    // Hash password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ username, email, password ,phone});
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.isJoi) {
      return next(errorHandler("Validation Error: " + err.details[0].message, 400));
    }
    if (err.code === 11000) {
      return next(errorHandler("Duplicate Field Error: This email is already registered", 409));
    }
    next(errorHandler(err.message, 500));
  }
};

const signin = async (req, res, next) => {
  const { email, password  } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(errorHandler("user not found", 404));
    }

    if (user?.isBlocked) {
      return next(errorHandler("Your account is blocked", 403));
    }
    const isValidPassword = await user.comparePassword(password, user.password);

    if (!isValidPassword) {
      return next(errorHandler("Invalid Credentials", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    user.isGoogle = false;
    user.lastLogin = Date.now();

    await user.save();

    user.password = undefined;

    res.status(200).json({ token, user });
  } catch (err) {
    next(errorHandler(err.message, err.code || 500));
  }
};

const google_Auth = async (req, res, next) => {
  const { email, name, photo } = req.body;
  try {
    const find_user = await User.findOne({ email });
    if (find_user) {
      const token = jwt.sign({ id: find_user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = find_user._doc;

      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json(rest);

      res.status(200).json({ token, rest });
    } else {
      const genaretedPassword =
        Math.random().toString(36).split(-8) +
        Math.random().toString(36).split(-8);

      const newUser = new User({
        username: name.split(" ").join("").toLowerCase(),
        password: genaretedPassword,
        email: email,
        avatar: photo,
      });

      newUser.isGoogle = true;

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json(rest);
      res.status(200).json({ token, rest });
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    // res.cookie("access_token", "", { httpOnly: true });
    res.status(200).json("signOut");
  } catch (err) {
    next(err);
  }
};

const logedUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google_Auth, signOut, logedUser };
