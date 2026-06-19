const todoService = require("../Service/todoService");

const todoController = {
    async deleteTodo(req, res) {
        const { todoId } = req.params;
        const { id: user_id } = req.user;
        const result = await todoService.deleteTodo(todoId, user_id);
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
    }
};

module.exports = todoController;
