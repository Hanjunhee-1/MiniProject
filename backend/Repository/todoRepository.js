const pool = require('../Database/dbConnection');
const Todo = require("../Model/todo");

const todoRepository = {
    async create(content, due_date, post_it_id) {
        /**
         * 기타 다른 필드에 대해서도 값을 설정해주는 작업이 필요함.
         */
        const [result] = await pool.query(
            "INSERT INTO todos (content, due_date, post_it_id) VALUES(?,?,?)",
            [content, due_date, post_it_id]
        );
        return new Todo({ id: result.insertId, created_at: new Date(), content, due_date, post_it_id });
    },

    async findByPostItId(post_it_id) {
        const [rows] = await pool.query(
            "SELECT * FROM todos WHERE post_it_id = ? ORDER BY due_date IS NULL, due_date ASC, id ASC, completed_at DESC",
            [post_it_id]
        );
        return rows.map(Todo.fromRow);
    },

    async findById(todo_id) {
        const [rows] = await pool.query(
            "SELECT * FROM todos WHERE id = ?",
            [todo_id]
        );
        return rows.length ? Todo.fromRow(rows[0]) : null;
    },

    async deleteById(todo_id) {
        const [result] = await pool.query(
            "DELETE FROM todos WHERE id = ?",
            [todo_id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = todoRepository;