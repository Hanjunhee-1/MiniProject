const express = require("express");

const { authMiddleware } = require("../Middleware/authMiddleware");

const todoController = require("../Controller/todoController");

const router = express.Router();


router.delete("/:todoId", authMiddleware, todoController.deleteTodo);

module.exports = router;