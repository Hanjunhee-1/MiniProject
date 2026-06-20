class Post_it_Todo {
    constructor(post_it_id, todo_id) {
        this.post_it_id = post_it_id;
        this.todo_id = todo_id;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Post_it_Todo(
            row.post_it_id,
            row.todo_id
        );
    }

    toJson() {
        return {
            post_it_id: this.post_it_id,
            todo_id: this.todo_id
        }
    }
}

module.exports = Post_it_Todo;