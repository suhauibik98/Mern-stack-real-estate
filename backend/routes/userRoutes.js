const express = require("express");
const {  updateUser , contactMessage,deleteUserAvatar,uploadUserAvatar , deleteUser} = require("../controllers/userControllers");
const { verifyUser } = require("../middleware/verifyUser");
const router = express.Router();

router.post("/update/:userId", verifyUser, updateUser);

router.delete("/delete/:userId", verifyUser, deleteUser);

router.patch("/upload-avatar", verifyUser, uploadUserAvatar);

router.delete("/delete-avatar", verifyUser, deleteUserAvatar);



/// for not auth contact  
router.post("/contact-message", contactMessage);



module.exports = router;
