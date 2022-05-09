const express = require('express');

const profileController = require("../controllers/profile")

const router = express.Router();

router.post('/fetchUserDetails',profileController.getUserProfile);
router.post('/updateUserProfile',profileController.updateUserProfile);


module.exports = router;