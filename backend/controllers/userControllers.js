const bcrypt = require("bcryptjs");
const { errorHandler } = require("../util/error");
const User = require("../models/User");

const signIn = async (req, res) => {
  res.json({ m: "hi" });
  // const {email,password}=req.body;
  // const user = await User.findOne({email});
  // if(!user){
  //     return res.status(400).json({message:"User not found"});
  //     }
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update own account"));

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(errorHandler(err.code, err));
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(404, "you can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { signIn, updateUser, deleteUser };
