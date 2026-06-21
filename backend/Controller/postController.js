const postService = require("../Service/postService");

const postController = {
    async getPostIts(req, res) {
        try {
            const { id: user_id } = req.user;
            const page = parseInt(req.query.page, 10) || 1;
            const { filter } = req.query;
            const { items, count } = await postService.getPostIts(user_id, page, filter);

            res.status(200).json({
                success: true,
                "post-its": items,
                count,
                pageSize: 8,
                pageNumber: page
            });
        } catch (error) {
            console.error("Error during getPostIts:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    /**
     * 이 아래 코드부터는 todo 와 관련되어있음.
     */
    async getTodos(req, res) {
        try {
            const { postId } = req.params;
            const todos = await postService.getTodos(postId);
            res.status(200).json({
                success: true,
                todos
            });
        } catch (error) {
            console.error("Error during getTodos:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    async createTodo(req, res) {
        try {
            const { id: user_id } = req.user;
            const { postId } = req.params;
            const { content, due_date } = req.body;
            const todo = await postService.createTodo(content, due_date, postId, user_id);
            res.status(201).json({
                success: true,
                todo
            });
        } catch (error) {
            console.error("Error during createTodo:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    async deleteTodo(req, res) {
        const { postId, todoId } = req.params;
        const { id: user_id } = req.user;
        const result = await postService.deleteTodo(postId, todoId, user_id);
        if (result) {
            res.status(200).json({
                success: true,
                message: "Todo deleted successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Todo not found or unauthorized"
            });
        }
    },

    async completeTodo(req, res) {
        try {
            const { postId, todoId } = req.params;
            const { isCompleted } = req.body;
            const { id: user_id } = req.user;

            const todo = await postService.completeTodo(postId, todoId, isCompleted, user_id);
            if (todo) {
                res.status(200).json({
                    success: true,
                    todo
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Todo not found or unauthorized"
                });
            }
        } catch (error) {
            console.error("Error during completeTodo:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = postController;