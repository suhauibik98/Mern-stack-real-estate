const express = require("express");
const {  updateUser , deleteUser} = require("../controllers/userControllers");
const { verifyUser } = require("../util/verifyUser");
const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

module.exports = router;
