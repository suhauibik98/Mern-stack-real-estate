const express = require("express")
const router = express.Router();
const {createListing,getLastListingNotAuth, getListingNotAuth,getListingsByFilter,getUserListings, getAllListingTypeSales,deleteImageByUrl,getAll ,getListingById ,deleteListingById , UpdateListingById , getEstateTypes , getEstateSubType} = require("../controllers/listingController");
const { verifyUser } = require("../middleware/verifyUser");




router.post("/create",verifyUser, createListing)

router.get("/get-all",verifyUser, getAll)

router.get("/get-card-id/:Listings_id",verifyUser, getListingById)

router.delete("/delete-card-id/:Listings_id",verifyUser, deleteListingById)

router.put("/update-card-id/:Listings_id",verifyUser,verifyUser, UpdateListingById)

router.get("/estate-types",verifyUser, getEstateTypes)

router.get("/estate-sub-type/:type",verifyUser, getEstateSubType)

router.delete("/delete-image",verifyUser, deleteImageByUrl)

router.get("/get-type/:type",verifyUser, getAllListingTypeSales)
router.get("/get-type/:type",verifyUser, getAllListingTypeSales)
router.get("/get-type/:type",verifyUser, getAllListingTypeSales)

router.get("/get-user-listings/:userId",verifyUser, getUserListings)

router.post("/get-listings-filter",verifyUser, getListingsByFilter)



// listing not auth routes
router.get("/get-listing-not-auth", getListingNotAuth)
router.get("/get-last-listing-not-auth", getLastListingNotAuth)

module.exports = router