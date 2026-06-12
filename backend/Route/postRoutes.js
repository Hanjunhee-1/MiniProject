const express = require("express");

const { authMiddleware } = require("../Middleware/authMiddleware");

const postController = require("../Controller/postController");

const router = express.Router();

router.get("/", authMiddleware, postController.getPostIts);

module.exports = router;