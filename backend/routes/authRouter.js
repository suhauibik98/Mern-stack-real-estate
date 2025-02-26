const express = require ("express")
const router = express.Router()
const {signup,signin , googleAuth,signOut, logedUser} = require("../controllers/authController")
const  {verifyUser}  = require("../middleware/verifyUser")

router.post("/signup" , signup)
router.post("/signin" , signin)

router.post("/google" , googleAuth)

router.post("/signout", verifyUser,signOut);
router.get("/logedUser",verifyUser, logedUser);

module.exports =router