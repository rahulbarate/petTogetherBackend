const express = require('express');

const homeController = require("../controllers/home")

const router = express.Router();

router.post('/fetchPostDetails',homeController.getUserPost);
router.post('/setPostLike',homeController.setPostLike);
router.post('/setNotification',homeController.setNotification);
module.exports = router;