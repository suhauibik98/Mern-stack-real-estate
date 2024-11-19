const { default: mongoose } = require("mongoose");
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
    const Cards = await Listings.find().populate(
      "userRef",
      "email avatar username"
    );

    res.status(200).json(Cards);
  } catch (err) {
    next(errorHandler(401, "not authraization"));
  }
};

const getListingById = async (req, res, next) => {
  const { Listings_id } = req.params;
  console.log(Listings_id);

  try {
    const listingId = await Listings.findById(Listings_id);

    res.status(200).json(listingId);
  } catch (err) {
    console.log(err);

    next(errorHandler(401, "not authraization"));
  }
};

const deleteListingById = async (req, res, next) => {
  const { Listings_id } = req.params;

  try {
    const listingId = await Listings.findById(Listings_id);

    if (!listingId) next(errorHandler(404, "not found"));

    await Listings.findByIdAndDelete(Listings_id);

    res.status(200).json({msg:"sccessfly"});
  } catch (err) {
    console.log(err);

    next(errorHandler(401, "not authraization"));
  }
};

const UpdateListingById = async (req , res , next)=>{
  const { Listings_id } = req.params;
  const { title , description , price , location , image } = req.body;
  console.log(req.body);
  
}
module.exports = { getListingById, createListing, getAll, deleteListingById , UpdateListingById };
