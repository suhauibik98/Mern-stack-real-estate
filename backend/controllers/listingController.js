const Listings = require("../models/Listing");
const { errorHandler } = require("../util/error");

const createListing = async (req, res, next) => {

  const {
    name,
    description,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    address,
    type,
    parking,
    offer,
    images,
    userRef,
  } = req.body;
  const newListing = new Listings({
    name,
    description,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    address,
    type,
    parking,
    offer,
    imageUrls: images,
    userRef: req.user._id,
  });

  try {
    await newListing.save();
    const user = await newListing.populate("userRef", "email avatar");
    
    res.status(201).json({ massages: "create successfully", user });
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ messages: "create failed" });
  }
};

const getAll = async (req, res, next) => {

  try {
 const Cards = await Listings.find()
 .populate("userRef", "email avatar username")
 
 res.status(200).json(Cards)


  } catch (err) {

    next(errorHandler(401, "not authraization"));

  }

};

module.exports = { createListing, getAll };
