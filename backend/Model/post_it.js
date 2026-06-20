class Post_it {
    constructor({ id, created_at, user_id }) {
        this.id = id;
        this.created_at = created_at;
        this.user_id = user_id;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Post_it({
            id: row.id,
            created_at: row.created_at,
            user_id: row.user_id
        });
    }

    toJson() {
        return {
            id: this.id,
            created_at: this.created_at,
            user_id: this.user_id
        }
    }
}

module.exports = Post_it;