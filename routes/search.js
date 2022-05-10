const express = require("express");
const { findSearchedUsers } = require("../controllers/search");
const router = express.Router();

router.get("/get/:searchQuery", findSearchedUsers);

module.exports = router;
