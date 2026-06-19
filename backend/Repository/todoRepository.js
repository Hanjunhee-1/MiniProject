const pool = require('../Database/dbConnection');
const Todo = require("../Model/todo");

const todoRepository = {
    async create(content, due_date, post_it_id) {
        const [result] = await pool.query(
            "INSERT INTO todos (content, due_date, post_it_id) VALUES(?,?,?)",
            [content, due_date, post_it_id]
        );
        return new Todo({ id: result.insertId, created_at: new Date(), content, due_date, post_it_id });
    },

    async findByPostItId(post_it_id) {
        const [rows] = await pool.query(
            "SELECT * FROM todos WHERE post_it_id = ? ORDER BY due_date ASC",
            [post_it_id]
        );
        return rows.map(Todo.fromRow);
    },

    async deleteByPostItId(post_it_id) {
        const [result] = await pool.query(
            "DELETE FROM todos WHERE post_it_id = ?",
            [post_it_id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = todoRepository;