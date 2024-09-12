const express = require("express")
const {signIn ,updateUser} = require("../controllers/userControllers")
const {verifyUser}  = require("../util/verifyUser")
const router = express.Router()



router.get("/test",signIn)
router.post("/update/:id",verifyUser,  updateUser)


module.exports = router