const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    type: {
      required: true,
      type: String,
    },
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
    discountPrice: {
      required: true,
      type: Number,
    },
    area: {
      required: true,
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    furnished: {
      type: Boolean,
      default:false,
    },
    address: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },

    parking: {
      type: Boolean,
      default:false,
    },
    offer: {
      type: Boolean,
      default:false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    estateType : {
      required: true,
      type: String,
      enum: ['Lands', 'Residential' , "Commercial"]
    },
    estateSubType : {
      required: true,
      type: String,
    },
    alhood : {
      // required: true,
      type: String,
    },
    plateNum:{
      // required: true,
      type: Number,
    },
    latitude:{
      type:Number,
    },
    longitude:{
      // required: true,
      type: Number,

    },
    
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const Listings = mongoose.model("listings", ListingSchema);
module.exports = Listings;
