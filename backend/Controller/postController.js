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
    }
};

module.exports = postController;