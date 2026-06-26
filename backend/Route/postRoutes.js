const express = require("express");

const { authMiddleware } = require("../Middleware/authMiddleware");

const postController = require("../Controller/postController");

const router = express.Router();


router.get("/", authMiddleware, postController.getPostIts);
router.get("/:postId", authMiddleware, postController.getTodos);
router.post("/:postId", authMiddleware, postController.createTodo);
router.delete("/:postId/todos/:todoId", authMiddleware, postController.deleteTodo);
router.patch("/:postId/todos/:todoId", authMiddleware, postController.updateTodo);


module.exports = router;