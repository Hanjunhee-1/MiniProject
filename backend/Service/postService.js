const postRepository = require("../Repository/postRepository");

const postService = {
    async getPostIts(user_id, page = 1, filter) {
        if (filter === "mine") {
            return await postRepository.findByUserId(user_id, page);
        }
        return await postRepository.findAll(page);
    }
};

module.exports = postService;
