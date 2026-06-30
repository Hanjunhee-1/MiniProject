const postRepository = require("../Repository/postRepository");
const todoRepository = require("../Repository/todoRepository");
const postItTodoRepository = require("../Repository/postItTodoRepository");
const userRepository = require("../Repository/userRepository");
const { updateTodo } = require("../Controller/postController");

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

        const owner = await userRepository.findById(post_it.user_id);
        if (!owner || owner.is_admin === 1) {
            console.log("not found post_it or admin owned");
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

    async deleteTodo(post_it_id, todo_id, user_id) {
        const post_it = await postRepository.findById(post_it_id);
        if (!post_it || Number(post_it.user_id) !== Number(user_id)) {
            return false;
        }
        const postItTodoRelation = await postItTodoRepository.findById(post_it_id, todo_id);
        if (!postItTodoRelation) {
            return false;
        }

        await postItTodoRepository.delete(post_it_id, todo_id);

        const remainingRelations = await postItTodoRepository.findByTodoId(todo_id);

        if (!remainingRelations || remainingRelations.length === 0) {
            await todoRepository.deleteById(todo_id);
        }

        return true;
    },

    async updateTodo(post_it_id, todo_id, isCompleted, user_id) {
        const post_it = await postRepository.findById(post_it_id);
        if (!post_it || Number(post_it.user_id) !== Number(user_id)) {
            return null;
        }

        const postItTodoRelation = await postItTodoRepository.findById(post_it_id, todo_id);
        if (!postItTodoRelation) {
            return null;
        }

        const todo = await todoRepository.findById(todo_id);
        if (!todo) {
            return null;
        }

        let completed_at = null;
        let duration = null;
        if (isCompleted) {
            const offset = 9 * 60 * 60 * 1000;
            const now = new Date();
            const kstDate = new Date(now.getTime() + offset);

            const year = kstDate.getUTCFullYear();
            const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
            const day = String(kstDate.getUTCDate()).padStart(2, "0");
            const hours = String(kstDate.getUTCHours()).padStart(2, "0");
            const minutes = String(kstDate.getUTCMinutes()).padStart(2, "0");
            const seconds = String(kstDate.getUTCSeconds()).padStart(2, "0");

            completed_at =
                `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            // 소요기간 계산
            const created = new Date(todo.created_at);
            const completed = new Date(completed_at);

            const diffDays =
                (completed - created) / (1000 * 60 * 60 * 24);

            duration = String(Math.ceil(diffDays));
        }

        return await todoRepository.updateCompletedAt(todo_id, completed_at, duration);
    }
};

module.exports = postService;
