const User = require("../models/User");
const { errorHandler } = require("../util/error");

const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
  try {
    await newUser.save();
    res.status(201).json("user created successfully");
  } catch (err) {
    // res.status(500).json(err.message)
    next(errorHandler(err.message, err.code))
    console.log(err.code);
    

    
  }
};

module.exports = { signup };
