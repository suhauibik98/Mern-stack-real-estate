const listing = require("../models/Listing");


const createListing = async (req, res, next) => {
  const {
    name,
    description,
    regularPrice,
    disscountPrice,
    bathrooms,
    bedrooms,
    furnished,
    address,
    type,
    parking,
    offer,
    imageUrls,
    userRef
  } = req.body;
  const newListing = new listing({
    name,
    description,
    regularPrice,
    disscountPrice,
    bathrooms,
    bedrooms,
    furnished,
    address,
    type,
    parking,
    offer,
    imageUrls,
    userRef
  });
  try {
    await newListing.save();
    res.status(201).json({ massages: "create successfully" });
    next()
  } catch (error) {
    
    res.status(400).json({ massages: "create failed" });
  
}
};

module.exports = {  createListing };
