const express = require("express")
const router = express.Router();
const {createListing ,getAll ,getListingById ,deleteListingById , UpdateListingById} = require("../controllers/listingController");
const { verifyUser } = require("../util/verifyUser");




router.post("/create",verifyUser, createListing)
router.get("/get-all",verifyUser, getAll)
router.get("/get-cours-id/:Listings_id",verifyUser, getListingById)
router.delete("/delete-cours-id/:Listings_id",verifyUser, deleteListingById)
router.put("/update-cours-id/:Listings_id",verifyUser, UpdateListingById)


module.exports = router