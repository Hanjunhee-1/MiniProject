const pool = require("../Database/dbConnection");
const Post_it = require("../Model/post_it");

const postRepository = {
    async create(user_id) {
        const [result] = await pool.query(
            "INSERT INTO post_its (user_id) VALUES (?)",
            [user_id]
        );
        return new Post_it({ id: result.insertId, created_at: new Date(), user_id });
    },

    async findById(post_it_id) {
        const [rows] = await pool.query(
            "SELECT * FROM post_its WHERE id = ?",
            [post_it_id]
        );
        return rows.length ? Post_it.fromRow(rows[0]) : null;
    },

    async findByUserId(user_id, page = 1, limit = 8) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query(`
            SELECT
                p.*,
                u.name AS user_name
            FROM post_its p
            JOIN users u
                ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [user_id, limit, offset]);
        const [countRows] = await pool.query(
            "SELECT COUNT(*) as count FROM post_its WHERE user_id = ?",
            [user_id]
        );
        return {
            items: rows.map(Post_it.fromRow),
            count: countRows[0].count
        };
    },

    async findAll(page = 1, limit = 8) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query(`
            SELECT
                p.*,
                u.name AS user_name
            FROM post_its p
            JOIN users u
                ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);
        const [countRows] = await pool.query(
            "SELECT COUNT(*) as count FROM post_its"
        );
        return {
            items: rows.map(Post_it.fromRow),
            count: countRows[0].count
        };
    }
};

module.exports = postRepository;