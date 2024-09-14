const express = require ("express")
const router = express.Router()
const {signup,signin , google_Auth,signOut} = require("../controllers/authController")

router.post("/signup" , signup)
router.post("/signin" , signin)
router.post("/google" , google_Auth)
router.get("/signout", signOut);

module.exports =router