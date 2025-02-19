const express = require ("express")
const router = express.Router()
const {signup,signin , google_Auth,signOut, logedUser} = require("../controllers/authController")
const  {verifyUser}  = require("../middleware/verifyUser")

router.post("/signup" , signup)
router.post("/signin" , signin)
router.post("/google" , google_Auth)
router.post("/signout", verifyUser,signOut);
router.get("/logedUser",verifyUser, logedUser);

module.exports =router