const postRepository = require("../Repository/postRepository");
const todoRepository = require("../Repository/todoRepository");
const postItTodoRepository = require("../Repository/postItTodoRepository");

const postService = {
    async getPostIts(user_id, page = 1, filter) {
        if (filter === "mine") {
            return await postRepository.findByUserId(user_id, page);
        }
        return await postRepository.findAll(page);
    },

    /**
     * 이 아래 코드부터는 todo 를 불러옴.
     */
    async getTodos(post_it_id) {
        const post_it = await postRepository.findById(post_it_id);
        if (!post_it) {
            console.log("not found post_it");
            return null;
        }

        return await todoRepository.findTodosByPostItIdOrdered(post_it_id);
    },

    async createTodo(content, due_date, post_it_id, user_id) {
        const postIt = await postRepository.findById(post_it_id);

        if (!postIt) {
            console.log("not found post_it");
            return null;
        }

        if (Number(postIt.user_id) !== Number(user_id)) {
            console.log("not matched user_id");
            return null;
        }

        const todo = await todoRepository.create(content, due_date);
        await postItTodoRepository.create(post_it_id, todo.id);

        return todo;
    },
};

module.exports = postService;
