const express = require("express");

const router = express.Router();

const authController = require("../Controller/authController");
const { authMiddleware } = require("../Middleware/authMiddleware");

router.post("/", authController.googleLogin);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;