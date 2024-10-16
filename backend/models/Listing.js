const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    regularPrice: {
      required: true,
      type: Number,
    },
    disscountPrice: {
      required: true,
      type: Number,
    },
    bathrooms: {
      required: true,
      type: Number,
    },
    bedrooms: {
      required: true,
      type: Number,
    },
    furnished: {
      required: true,
      type: Boolean,
    },
    address: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    parking: {
      required: true,
      type: Boolean,
    },
    offer: {
      required: true,
      type: Boolean,
    },
    imageUrls: {
      type: Array,
      required: true,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png",
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listings = mongoose.model("listings", ListingSchema);
module.exports = Listings;
