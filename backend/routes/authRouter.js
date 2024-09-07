const express = require ("express")
const router = express.Router()
const {signup,signin , google_Auth} = require("../controllers/authController")

router.post("/signup" , signup)
router.post("/signin" , signin)
router.post("/google" , google_Auth)

module.exports =router