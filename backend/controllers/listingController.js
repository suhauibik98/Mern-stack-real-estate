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
console.log(Cards);

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

const UpdateListingById = async (req, res, next) => {
  const { Listings_id } = req.params; // Get the ID from request params
  const {
    name,
    address,
    bedrooms,
    bathrooms,
    description,
    discountPrice,
    furnished,
    imageUrls,
    offer,
    parking,
    regularPrice,
    type,
  } = req.body; // Destructure properties from the body

  try {
    // Validate ID
    if (!Listings_id) {
      return next(errorHandler(400, "Listing ID is required"));
    }

    // Find the listing by ID
    const listing = await Listings.findById(Listings_id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Update the listing with new values (if provided)
    if (name) listing.name = name;
    if (address) listing.address = address;
    if (bedrooms !== undefined) listing.bedrooms = bedrooms;
    if (bathrooms !== undefined) listing.bathrooms = bathrooms;
    if (description) listing.description = description;
    if (discountPrice !== undefined) listing.discountPrice = discountPrice;
    if (furnished !== undefined) listing.furnished = furnished;
    if (Array.isArray(imageUrls) && imageUrls.length > 0) listing.imageUrls = imageUrls;
    if (offer !== undefined) listing.offer = offer;
    if (parking !== undefined) listing.parking = parking;
    if (regularPrice !== undefined) listing.regularPrice = regularPrice;
    if (type) listing.type = type;

    // Save the updated listing
    const updatedListing = await listing.save();

    // Send the updated listing as a response
    res.status(200).json(updatedListing);
  } catch (error) {
    // Handle errors
    return next(errorHandler(error.code || 500, error.message || "An error occurred while updating the listing"));
  }
};

module.exports = { getListingById, createListing, getAll, deleteListingById , UpdateListingById };
