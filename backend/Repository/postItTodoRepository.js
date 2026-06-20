const pool = require("../Database/dbConnection");
const Post_it_todo = require("../Model/post_it_todo");

const postItTodoRepository = {
    async create(post_it_id, todo_id) {
        const [result] = await pool.query(
            "INSERT INTO post_it_todos (post_it_id, todo_id) VALUES (?, ?)",
            [post_it_id, todo_id]
        );
        return new Post_it_todo(post_it_id, todo_id);
    },

    async findById(post_it_id, todo_id) {
        const [rows] = await pool.query(
            "SELECT * FROM post_it_todos WHERE post_it_id = ? AND todo_id = ?",
            [post_it_id, todo_id]
        );
        return rows.length ? Post_it_todo.fromRow(rows[0]) : null;
    },

    async findByPostItId(post_it_id) {
        const [rows] = await pool.query(
            "SELECT * FROM post_it_todos WHERE post_it_id = ?",
            [post_it_id]
        );
        return rows.map(Post_it_todo.fromRow);
    },

    async findByTodoId(todo_id) {
        const [rows] = await pool.query(
            "SELECT * FROM post_it_todos WHERE todo_id = ?",
            [todo_id]
        );
        return rows.map(Post_it_todo.fromRow);
    },

    async delete(post_it_id, todo_id) {
        const [result] = await pool.query(
            "DELETE FROM post_it_todos WHERE post_it_id = ? AND todo_id = ?",
            [post_it_id, todo_id]
        );
        return result.affectedRows > 0;
    }
}