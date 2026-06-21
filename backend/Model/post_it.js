class Post_it {
    constructor({ id, created_at, user_id, user_name }) {
        this.id = id;
        this.created_at = created_at;
        this.user_id = user_id;
        this.user_name = user_name;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Post_it({
            id: row.id,
            created_at: row.created_at,
            user_id: row.user_id,
            user_name: row.user_name
        });
    }

    toJson() {
        return {
            id: this.id,
            created_at: this.created_at,
            user_id: this.user_id,
            user_name: this.user_name
        }
    }
}

module.exports = Post_it;