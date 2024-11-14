const express = require("express")
const router = express.Router();
const {createListing ,getAll} = require("../controllers/listingController");
const { verifyUser } = require("../util/verifyUser");




router.post("/create",verifyUser, createListing)
router.get("/get-all",verifyUser, getAll)


module.exports = router