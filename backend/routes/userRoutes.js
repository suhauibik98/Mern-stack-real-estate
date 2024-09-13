const express = require("express");
const { signIn, updateUser , deleteUser} = require("../controllers/userControllers");
const { verifyUser } = require("../util/verifyUser");
const router = express.Router();

router.get("/test", signIn);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

module.exports = router;
