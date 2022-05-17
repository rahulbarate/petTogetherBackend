const express = require("express");
const { findChats } = require("../controllers/chat");
const router = express.Router();

router.get("/get/chats/:userId", findChats);

module.exports = router;