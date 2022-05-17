const express = require('express');
const router = express.Router();


const profileController = require("../controllers/profile")



router.post('/fetchUserDetails',profileController.getUserProfile);
router.post('/updateUserProfile',profileController.updateUserProfile);
router.post('/uploadPost',profileController.uploadPost);


module.exports = router;