const User = require("../models/User");
const { errorHandler } = require("../util/error");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
        // Handle validation errors (e.g., missing required fields)
        next(errorHandler( 400,"Validation Error: " + err.message));
    } else if (err.code && err.code === 11000) {
        // Handle duplicate key error (e.g., email already exists)
        next(errorHandler(409,"Duplicate Field Error: This email is already registered"));
    } else {
        // Generic error handler for other errors
        next(errorHandler( err.code || 500,err.message));
    }
}
};


const signin = async (req,res,next)=>{
 const {email,password} = req.body;
 try{
  const validUser = await User.findOne({email})
  if(!validUser){
    return next(errorHandler(404,"user not found"))
  }
  const isValidPassword = bcrypt.compareSync(password , validUser.password)
  if(!isValidPassword){
    return next(errorHandler(401,"Invalid Credentials"))
  }
 const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
 const {password:pass , ...rest} = validUser._doc;
 res
 .cookie("access_token" ,  token,{httpOnly:true})
.status(200)
.json(rest)
 }
 catch(err){
  next(errorHandler(err.code || 500,err.message))
 }





}

module.exports = { signup , signin};
