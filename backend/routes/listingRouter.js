const express = require("express")
const router = express.Router();
const {createListing ,getAll ,getListingById ,deleteListingById} = require("../controllers/listingController");
const { verifyUser } = require("../util/verifyUser");




router.post("/create",verifyUser, createListing)
router.get("/get-all",verifyUser, getAll)
router.get("/get-cours-id/:Listings_id",verifyUser, getListingById)
router.delete("/delete-cours-id/:Listings_id",verifyUser, deleteListingById)


module.exports = router