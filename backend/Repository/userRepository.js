const pool = require("../Database/dbConnection");
const User = require("../Model/user");

const userRepository = {
    // 1. 사용자 생성
    async create(name, email) {
        const [result] = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        // 생성된 사용자를 객체로 리턴
        return new User({ id: result.insertId, name, email });
    },

    // 2. 이메일로 사용자 조회
    async findByEmail(email) {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        // 조회된 첫 번째 row를 User 객체로 변환하여 반환
        return User.fromRow(rows[0]);
    },

    // 3. ID로 사용자 조회
    async findById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return User.fromRow(rows[0]);
    }
};

module.exports = userRepository;
