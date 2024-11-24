const jwt = require("jsonwebtoken");
const { errorHandler } = require("../util/error");
const User = require("../models/User");

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
      
    }

    const userObj = await User.findById(decodedToken.id);

    req.user = userObj;

    next();
  });
};

module.exports = { verifyUser };
