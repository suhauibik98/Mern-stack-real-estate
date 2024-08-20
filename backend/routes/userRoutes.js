const express = require("express")
const {signIn} = require("../controllers/userControllers")
const router = express.Router()



router.get("/test",signIn)



module.exports = router