const jwt = require("jsonwebtoken");
const { errorHandler } = require("../util/error");
const User = require("../models/User");

const verifyUser = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(errorHandler("Not authorized to access this route", 401));
    }

    // verify the token , and get the payload object
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return next(errorHandler("Access Forbidden", 403));
      }

      // create a req key called user , contain the id for logged user
      if (req.user?.isBlocked) {
        return next(errorHandler("Your account has been blocked", 403));
      }
      req.user = await User.findById(decodedToken.id).select("-password");

      next();
    });
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(errorHandler("Not authorized to access this route", 401));
    }
    // verify the token , and get the payload object
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return next(errorHandler("Access Forbidden", 403));
      }

      // create a req key called user , contain the id for logged user
      const user = await User.findById(decodedToken.id).select("-password");
      if (!user || !user?.isAdmin) {
        return next(errorHandler("Access forbidden: Admins only", 403));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyUser, verifyAdmin };
