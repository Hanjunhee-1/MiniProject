const todoRepository = require("../Repository/todoRepository");
const postRepository = require("../Repository/postRepository");

const todoService = {
    async deleteTodo(todo_id, user_id) {
        const todo = await todoRepository.findById(todo_id);
        if (!todo) {
            return false;
        }

        const postIt = await postRepository.findById(todo.post_it_id);
        if (!postIt) {
            return false;
        }

        if (Number(postIt.user_id) !== Number(user_id)) {
            return false;
        }

        await todoRepository.deleteById(todo_id);
        return true;
    }
};

module.exports = todoService;
