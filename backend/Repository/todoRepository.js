const pool = require('../Database/dbConnection');
const Todo = require("../Model/todo");

const todoRepository = {
    async create(content, due_date) {
        const [result] = await pool.query(
            "INSERT INTO todos (content, due_date, elapsed_date) VALUES(?,?, '0')",
            [content, due_date]
        );
        return new Todo({ id: result.insertId, created_at: new Date(), content, due_date, elapsed_date: "0" });
    },

    async findById(todo_id) {
        const [rows] = await pool.query(
            "SELECT * FROM todos WHERE id = ?",
            [todo_id]
        );
        return rows.length ? Todo.fromRow(rows[0]) : null;
    },

    async findTodosByPostItIdOrdered(post_it_id) {
        const [rows] = await pool.query(`
            SELECT t.* 
            FROM todos t
            JOIN post_it_todos pit ON t.id = pit.todo_id
            WHERE pit.post_it_id = ?
            ORDER BY 
                t.due_date IS NULL ASC,   
                t.due_date ASC,            
                t.created_at ASC           
        `, [post_it_id]);
        return rows.map(Todo.fromRow);
    },

    async deleteById(todo_id) {
        const [result] = await pool.query(
            "DELETE FROM todos WHERE id = ?",
            [todo_id]
        );
        return result.affectedRows > 0;
    },

    async updateCompletedAt(todo_id, completed_at, duration) {
        await pool.query(
            "UPDATE todos SET completed_at = ?, duration = ? WHERE id = ?",
            [completed_at, duration, todo_id]
        );
        return await this.findById(todo_id);
    },

    async incrementElapsedDays() {
        const [result] = await pool.query(
            "UPDATE todos SET elapsed_date = CAST(CAST(COALESCE(elapsed_date, '0') AS UNSIGNED) + 1 AS CHAR) WHERE completed_at IS NULL"
        );
        return result.affectedRows;
    }
};

module.exports = todoRepository;