const postRepository = require("../Repository/postRepository");
const todoRepository = require("../Repository/todoRepository");

const postService = {
    async getPostIts(user_id, page = 1, filter) {
        if (filter === "mine") {
            return await postRepository.findByUserId(user_id, page);
        }
        return await postRepository.findAll(page);
    },

    /**
     * 이 아래 코드부터는 todoRepository 를 사용함.
     */
    async getTodos(post_it_id) {
        return await todoRepository.findByPostItId(post_it_id);
    },

    async createTodo(content, due_date, post_it_id, user_id) {
        const postIt = await postRepository.findById(post_it_id);

        if (!postIt) {
            return null;
        }

        if (Number(postIt.user_id) !== Number(user_id)) {
            return null;
        }

        return await todoRepository.create(content, due_date, post_it_id);
    },
};

module.exports = postService;
