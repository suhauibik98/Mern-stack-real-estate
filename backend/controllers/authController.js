const User = require("../models/User");
const { errorHandler } = require("../util/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const signup = async (req, res, next) => {

  const { username, email, password } = req.body;

  const newUser = new User({ username, email, password });

  try {

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    if (err.name === "ValidationError") {
      // Handle validation errors (e.g., missing required fields)
      next(errorHandler(400, "Validation Error: " + err.message));
    } else if (err.code && err.code === 11000) {

      // Handle duplicate key error (e.g., email already exists)

      next(
        errorHandler(
          409,
          "Duplicate Field Error: This email is already registered"
        )
      );
    } else {
      // Generic error handler for other errors
      next(errorHandler(err.code || 500, err.message));
    }
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }).select("+password");

    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }
    const isValidPassword = await validUser.comparePassword(
      password,
      validUser.password
    );

    if (!isValidPassword) {
      return next(errorHandler(401, "Invalid Credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET , {expiresIn :process.env.JWT_EXPIRE});

    validUser.password = undefined;
    validUser.isGoogle = false

    res
    // .cookie("access_token", token, { httpOnly: true  , maxAge : 1 * 60 * 1000})
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(validUser);
  } catch (err) {
    next(errorHandler(err.code || 500, err.message));
  }
};

const google_Auth = async (req, res, next) => {
 
  const { email, name, photo } = req.body;
  try {
    const find_user = await User.findOne({ email });
    if (find_user) {
      const token = jwt.sign({ id: find_user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = find_user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
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

      newUser.isGoogle = true
      

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try{
    res.cookie("access_token", "", { httpOnly: true })
    res.status(200).json("signOut")
  }
  catch(err){
    next(err)
  }
  
   
  };

const logedUser = async (req,res , next)=>{
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
  
  } catch (error) {
    next(error)
  }
  
}

module.exports = { signup, signin, google_Auth , signOut , logedUser };
