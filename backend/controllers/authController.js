const User = require("../models/User");
const { errorHandler } = require("../util/error");

const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
        // Handle validation errors (e.g., missing required fields)
        next(errorHandler("Validation Error: " + err.message, 400));
    } else if (err.code === 11000) {
        // Handle duplicate key error (e.g., email already exists)
        next(errorHandler("Duplicate Field Error: This email is already registered", 409));
    } else {
        // Generic error handler for other errors
        next(errorHandler(err.message, err.code || 500));
    }
}
};

module.exports = { signup };
