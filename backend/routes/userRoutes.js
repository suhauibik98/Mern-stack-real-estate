const express = require("express")
const {signIn} = require("../controllers/userControllers")
const router = express.Router()



router.get("/",signIn)



module.exports = router