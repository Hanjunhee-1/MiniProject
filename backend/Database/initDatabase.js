const pool = require("./dbConnection");

async function initDatabase() {
    const dbName = process.env.DB_NAME;

    // db 가 없을 경우 생성
    await pool.query(
        `create database if not exists \`${dbName}\``
    );

    console.log(`✅ Database ${dbName} is ready`);

    // db 선택
    await pool.query(`use \`${dbName}\``);

    // users 테이블 생성
    await pool.query(`
        create table if not exists users (
            id int primary key auto_increment,
            name varchar(255) not null,
            email varchar(255) not null unique
        )
    `);

    // post_its 테이블 생성
    await pool.query(`
        create table if not exists post_its (
            id int primary key auto_increment,
            created_at datetime default current_timestamp,
            user_id int not null,
            foreign key (user_id) references users(id)
        )
    `);

    // todos 테이블 생성
    await pool.query(`
        create table if not exists todos (
            id int primary key auto_increment,
            content text not null,
            created_at datetime default current_timestamp,
            completed_at datetime,
            duration varchar(3),
            due_date datetime, 
            elapsed_date varchar(3)
        )
    `);

    // post_its : todos -> N:M 테이블 생성
    await pool.query(`
        create table if not exists post_it_todos (
            id int primary key auto_increment,
            post_it_id int not null,
            todo_id int not null,
            CONSTRAINT uk_post_it_todo UNIQUE (post_it_id, todo_id),
            foreign key (post_it_id) references post_its(id),
            foreign key (todo_id) references todos(id)
        )    
    `);
}

module.exports = initDatabase;