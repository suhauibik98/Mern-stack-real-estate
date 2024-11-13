const listing = require("../models/Listing");


const createListing = async (req, res, next) => {
  console.log(req.body);
  
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
    userRef
  } = req.body;
  const newListing = new listing({
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
    imageUrls : images,
    userRef : req.user._id
  });
  console.log();
  
  try {
    await newListing.save();
    const user = await newListing.populate("userRef" , "email")
    res.status(201).json({ massages: "create successfully" , user });
    next()
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ massages: "create failed" });
  
}
};

module.exports = {  createListing };
