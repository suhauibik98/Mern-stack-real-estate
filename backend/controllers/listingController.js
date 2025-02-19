const { default: mongoose } = require("mongoose");
const Listings = require("../models/Listing");
const { errorHandler } = require("../util/error");
const path = require("path");
const File = require("../models/File");
const fs = require("fs");
const createListing = async (req, res, next) => {
  const {
    name,
    description,
    area,
    city,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    address,
    type,
    parking,
    offer,
    estateType,
    estateSubType,
    alhood,
    plateNum,
    latitude,
    longitude,
  } = req.body;
  // Check if files were uploaded
  console.log(req.body);

  if (!req.files || !req.files.images) {
    return res.status(400).json({ messages: "No images uploaded" });
  }

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];
  const imageUrls = [];

  try {
    // Process each uploaded file
    for (const image of images) {
      let imagesName =
        Date.now() + "_" + image.name.split(" ").join("").toLowerCase();
      const uploadPath = path
        .join(__dirname, "../uploads/images", imagesName)
        .trim(); // Ensures cross-platform compatibility

      // Move the file to the desired directory
      await image.mv(uploadPath);

      // const saveFile = new File({
      //   originalName: image.name,
      //   uniqueName: imagesName,
      //   filePath: uploadPath,
      //   fileType: image.mimetype,
      //   fileSize: image.size,
      //   user: req.user._id,
      // })
      // await saveFile.save();
      // Add the file path to imageUrls (update this if uploading to cloud storage)
      const publicUrl = `/uploads/images/${imagesName}`;

      imageUrls.push(publicUrl);
    }

    // Create a new listing with the image URLs
    const newListing = new Listings({
      name,
      description,
      area,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      address,
      city,
      type,
      parking,
      offer,
      estateType,
      estateSubType,
      alhood,
      plateNum,
      imageUrls,
      latitude,
      longitude,
      userRef: req.user._id,
    });

    await newListing.save();
    const listing_info = await newListing.populate("userRef", "email avatar");

    res.status(201).json({ messages: "Create successfully", listing_info });
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ messages: "Create failed" });
  }
};

const getAll = async (req, res, next) => {
  const { page } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const totalListing = await Listings.countDocuments();

    const Cards = await Listings.find()
      .limit(limit)
      .skip(skip)
      .populate("userRef", "email avatar username");
    res.status(200).json({
      Cards,
      page,
      totalPage: Math.ceil(totalListing / limit),
      totalListing,
    });
  } catch (err) {
    next(errorHandler("not authraization", 401));
  }
};


const getListingById = async (req, res, next) => {
  const { Listings_id } = req.params;

  try {
    const listingId = await Listings.findById(Listings_id);

    res.status(200).json(listingId);
  } catch (err) {
    console.log(err);

    next(errorHandler("not authraization", 401));
  }
};

const deleteListingById = async (req, res, next) => {
  const { Listings_id } = req.params;
  console.log(req.user);

  try {
    const listingId = await Listings.findById(Listings_id);

    // console.log(listingId.imageUrls);
    if (!listingId) next(errorHandler("not found", 404));

    const imageDeletionPromises = listingId?.imageUrls.map((imageUrl) => {
      const filePath = path.join(__dirname, "../", imageUrl);

      return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error deleting file ${filePath}:`, err);
              reject(err);
            } else {
              // console.log(`Deleted file: ${filePath}`);
              resolve();
            }
          });
        } else {
          // console.log(`File not found: ${filePath}`);
          resolve(); // Resolve even if the file doesn't exist
        }
      });
    });

    // Wait for all files to be deleted
    await Promise.all(imageDeletionPromises);

    await Listings.findByIdAndDelete(Listings_id);

    res.status(200).json({ msg: "succsseflly" });
  } catch (err) {
    console.log(err);

    next(errorHandler("not authraization", 401));
  }
};

const UpdateListingById = async (req, res, next) => {
  const { Listings_id } = req.params;
  const {
    name,
    address,
    city,
    bedrooms,
    bathrooms,
    description,
    area,
    discountPrice,
    furnished,
    imageUrls = [],
    offer,
    parking,
    regularPrice,
    type,
    estateSubType,
    estateType,
    plateNum,
    alhood,
    latitude,
    longitude,
  } = req.body;

  try {
    // Validate ID
    if (!Listings_id) {
      return next(errorHandler("Listing ID is required", 400));
    }

    // Find the listing by ID
    const listing = await Listings.findById(Listings_id);
    if (!listing) {
      return next(errorHandler("Listing not found", 404));
    }

    // Handle new image uploads
    let newImageUrls = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Process and upload each image
      for (const image of images) {
        const imageName =
          Date.now() + "_" + image.name.split(" ").join("").toLowerCase();
        const uploadPath = path
          .join(__dirname, "../uploads/images", imageName)
          .trim(); // Ensures cross-platform compatibility

        await image.mv(uploadPath); // Save the image
        const publicUrl = `/uploads/images/${imageName}`;
        newImageUrls.push(publicUrl); // Store the public path of the image
      }
    }

    // Combine current image URLs (from DB) and new ones
    const updatedImageUrls = [
      ...(Array.isArray(listing.imageUrls) ? listing.imageUrls : []), // Current images in DB
      ...newImageUrls, // New uploaded images
    ];

    // Update the listing with new values
    if (name) listing.name = name;
    if (address) listing.address = address;
    if (city) listing.city = city;
    if (bedrooms !== undefined) listing.bedrooms = bedrooms;
    if (bathrooms !== undefined) listing.bathrooms = bathrooms;
    if (description) listing.description = description;
    if (discountPrice !== undefined) listing.discountPrice = discountPrice;
    if (furnished !== undefined) listing.furnished = furnished;
    listing.imageUrls = updatedImageUrls; // Update images
    if (offer !== undefined) listing.offer = offer;
    if (parking !== undefined) listing.parking = parking;
    if (estateType !== undefined) listing.estateType = estateType;
    if (estateSubType !== undefined) listing.estateSubType = estateSubType;
    if (regularPrice !== undefined) listing.regularPrice = regularPrice;
    if (area !== undefined) listing.area = area;
    if (type) listing.type = type;
    if (alhood) listing.alhood = alhood;
    if (plateNum) listing.plateNum = plateNum;
    if (latitude) listing.latitude = latitude;
    if (longitude) listing.longitude = longitude;

    // Save the updated listing
    const updatedListing = await listing.save();

    // Send the updated listing as a response
    res.status(200).json(updatedListing);
  } catch (error) {
    // Handle errors
    return next(
      errorHandler(
        error.message || "An error occurred while updating the listing",
        error.code || 500
      )
    );
  }
};


const deleteImageByUrl = async (req, res, next) => {
  const { imageUrl, list_id } = req.body;

  try {
    // Validate required fields
    if (!imageUrl || !list_id) {
      return res
        .status(400)
        .json({ message: "Image URLs and listing ID are required" });
    }

    // Find the listing by ID
    const listing = await Listings.findById(list_id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Ensure imageUrl is an array
    const imageUrlsToDelete = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

    // Track results for success and failures
    const deletedUrls = [];
    const failedDeletions = [];

    for (const url of imageUrlsToDelete) {
      // Check if the image URL exists in the listing
      if (!listing.imageUrls.includes(url)) {
        failedDeletions.push({ url, reason: "Image URL not found in listing" });
        continue;
      }

      // Remove the image URL from the listing's array
      listing.imageUrls = listing.imageUrls.filter(
        (existingUrl) => existingUrl !== url
      );

      // Get the full file path
      const filePath = path.join(__dirname, "../", url);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        failedDeletions.push({ url, reason: "File not found on the server" });
        continue;
      }

      // Delete the file
      try {
        fs.unlinkSync(filePath);
        deletedUrls.push(url);
      } catch (err) {
        console.error("Error deleting file:", err);
        failedDeletions.push({ url, reason: "Error deleting file" });
      }
    }

    // Save the updated listing
    await listing.save();

    // Respond with the results
    return res.status(200).json({
      message: "Image deletion process completed",
      deletedUrls,
      failedDeletions,
      updatedImageUrls: listing.imageUrls, // Updated image URLs for frontend sync
    });
  } catch (error) {
    console.error("Error handling delete request:", error);
    return next(
      errorHandler(
        error.message || "An error occurred while deleting the images",
        error.code || 500
      )
    );
  }
};

const getAllListingTypeSales = async (req, res, next) => {
  const { page } = req.query;
  const limit = 4;
  const skip = (page - 1) * limit;

  try {
    const totalListing = await Listings.countDocuments({ type: "sale" });

    const listings = await Listings.find({ type: "sale" })
      .limit(limit)
      .skip(skip)
      .populate("userRef", "email avatar username");
    res.status(200).json({
      listings,
      page,
      totalPage: Math.ceil(totalListing / limit),
      totalListing,
    });
  } catch (error) {
    next(errorHandler("not found", 404));
  }
};

const getUserListings = async (req, res, next) => {
  const { userId } = req.params;
  const { page } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const totalListing = await Listings.countDocuments({ userRef: userId });

    const listings = await Listings.find({ userRef: userId })
      .limit(limit)
      .skip(skip)
      .populate("userRef", "email avatar username");
    res.status(200).json({
      listings,
      page,
      totalPage: Math.ceil(totalListing / limit),
      totalListing,
    });
  } catch (error) {
    next(errorHandler("not found", 404));
  }
};
// fillter
const getListingsByFilter = async (req, res, next) => {
  const { page } = req.query;
  const { alhood, address, type, city, estateType } = req.body?.formData;
  const formReq = {};
  const limit = 20;
  const skip = (page - 1) * limit;
  console.log(req.body);
  try {
    if (type) formReq.type = type;
    if (estateType && estateType !== "All") formReq.estateType = estateType;
    if (city) formReq.city = city;
    if (address) formReq.address = address;
    if (alhood) formReq.alhood = alhood;

    const totalListing = await Listings.countDocuments(formReq);
    const listings = await Listings.find(formReq)
      .limit(limit)
      .skip(skip)
      .populate("userRef", "email avatar username");
    res.status(200).json({
      listings,
      page,
      totalPage: Math.ceil(totalListing / limit),
      totalListing,
    });
  } catch (error) {
    next(errorHandler("not found", 404));
  }
};
const getEstateTypes = async (req, res, next) => {
  try {
    const estateMainTypes = await Listings.schema.path("estateType").enumValues;
    res.status(200).json(estateMainTypes);
  } catch (error) {
    return next(
      errorHandler(
        error.message || "An error occurred while updating the listing",
        error.code || 500
      )
    );
  }
};

const getEstateSubType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const validTypes = ["Lands", "Residential", "Commercial"];

    if (!validTypes.includes(type)) {
      return next(errorHandler("invalid Listing type", 404));
    }

    const Lands = [
      "Residential",
      "Commercial",
      "Agricultural",
      "Mixed-Use",
      "Industrial",
    ];

    const Residential = [
      "Apartment",
      "Villas and Palaces",
      "Houses and Homes",
      "Farms and Chalets",
      "Residential Buildings",
    ];

    const Commercial = [
      "Offices for Sale",
      "Shops for Sale",
      "Complexes for Sale",
      "Showrooms for Sale",
      "Restaurants and Cafés for Sale",
      "Warehouses for Sale",
      "Supermarkets for Sale",
      "Clinics for Sale",
      "Commercial Villas for Sale",
      "Full Floors for Sale",
      "Hotels for Sale",
      "Factories for Sale",
      "Staff Accommodation for Sale ",
    ];

    if (type === "Lands") {
      return res.status(200).json(Lands);
    } else if (type === "Residential") {
      return res.status(200).json(Residential);
    } else {
      return res.status(200).json(Commercial);
    }
  } catch (error) {
    return next(
      errorHandler(
        error.message || "An error occurred while updating the listing",
        error.code || 500
      )
    );
  }
};

// get listing without auth
const getListingNotAuth = async (req, res, next) => {
  const limit = 4;
  try {
    const Cards = await Listings.aggregate([
      { $sample: { size: limit } }, // Fetch random 'limit' number of listings
    ]).lookup({
      from: "users",
      localField: "userRef",
      foreignField: "_id",
      as: "userRef",
    });
    res.status(200).json(Cards);
  } catch (err) {
    next(errorHandler("not authraization", 401));
  }
};

const getLastListingNotAuth = async (req, res, next) => {
  const limit = 4;
  try {
    const Cards = await Listings.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userRef", "email avatar username");
    res.status(200).json(Cards);
  } catch (err) {
    next(errorHandler("not authraization", 401));
  }
};
module.exports = {
  getListingById,
  createListing,
  getAll,
  deleteListingById,
  UpdateListingById,
  getEstateTypes,
  getEstateSubType,
  deleteImageByUrl,
  getAllListingTypeSales,
  getUserListings,
  getListingsByFilter,
  getListingNotAuth,
  getLastListingNotAuth,
};
