const pool = require('../Database/dbConnection');
const Todo = require("../Model/todo");

const todoRepository = {
    async create(content, due_date) {
        /**
         * 기타 다른 필드에 대해서도 값을 설정해주는 작업이 필요함.
         */
        const [result] = await pool.query(
            "INSERT INTO todos (content, due_date) VALUES(?,?)",
            [content, due_date]
        );
        return new Todo({ id: result.insertId, created_at: new Date(), content, due_date });
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

    async updateCompletedAt(todo_id, completed_at) {
        await pool.query(
            "UPDATE todos SET completed_at = ? WHERE id = ?",
            [completed_at, todo_id]
        );
        return await this.findById(todo_id);
    }
};

module.exports = todoRepository;