const express = require("express")
const router = express.Router();
const {createListing} = require("../controllers/listingController");
const { verifyUser } = require("../util/verifyUser");




router.post("/create",verifyUser, createListing)


module.exports = router