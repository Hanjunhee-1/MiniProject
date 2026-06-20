const pool = require("./dbConnection");

async function seed() {
    const dbName = process.env.DB_NAME;

    await pool.query(`use \`${dbName}\``);

    /**
     * 나중에 테스트 데이터가 필요하다면 seeding 추가하기
     */
}

module.exports = seed;