class Todo {
    constructor({ id, content, created_at, completed_at, duration, due_date, elapsed_date, post_it_id }) {
        this.id = id;
        this.content = content;
        this.created_at = created_at;
        this.completed_at = completed_at;
        this.duration = duration;
        this.due_date = due_date;
        this.elapsed_date = elapsed_date;
        this.post_it_id = post_it_id;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Todo({
            id: row.id,
            content: row.content,
            created_at: row.created_at,
            completed_at: row.completed_at,
            duration: row.duration,
            due_date: row.due_date,
            elapsed_date: row.elapsed_date,
            post_it_id: row.post_it_id
        })
    }

    toJson() {
        return {
            id: this.id,
            content: this.content,
            created_at: this.created_at,
            completed_at: this.completed_at,
            duration: this.duration,
            due_date: this.due_date,
            elapsed_date: this.elapsed_date,
            post_it_id: this.post_it_id
        }
    }
}

module.exports = Todo;