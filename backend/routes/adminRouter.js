const express = require('express');
const router = express.Router();
const { getAllUser,getMessegesFromDB,deleteUserAndHisListingsByAdmin,createUser,getAllListingsForAdmin,getAllListingsCount ,getAllUserCount,deleteUserListingsAdmin,getUserListingsAdmin,blockedUser, changeUserRole ,getUserById ,updateUser } = require('../controllers/adminController');
const {verifyAdmin } = require('../middleware/verifyUser');

router.get('/get-all-users',verifyAdmin, getAllUser);

router.get('/get-all-listings-admin',verifyAdmin, getAllListingsForAdmin);

router.get('/get-all-users-count',verifyAdmin, getAllUserCount);

router.get('/get-all-listings-count',verifyAdmin, getAllListingsCount);

router.patch('/change-role-user/:userId',verifyAdmin, changeUserRole);

router.patch('/blocked-user/:userId',verifyAdmin, blockedUser);

router.get('/get-user/:userId',verifyAdmin,getUserById);

router.put('/update/:userId', verifyAdmin, updateUser);

router.get('/get-user-listings-admin/:userId', verifyAdmin, getUserListingsAdmin);

router.delete('/delete-user-listings-admin/:Listings_id', verifyAdmin, deleteUserListingsAdmin);

router.post('/createUser', verifyAdmin, createUser);

router.get('/get-messeges-from-db', verifyAdmin, getMessegesFromDB);

router.delete('/delete-user-and-listings-by-admin/:userId', verifyAdmin, deleteUserAndHisListingsByAdmin);

module.exports = router;



