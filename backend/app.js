require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prefix = require("./Utils/prefix");
const initDB = require("./Database/initDatabase");

const app = express();

const routers = [
    require("./Route/authRoutes")
]

app.use(cors());
app.use(express.json());

// 일단 test
app.get("/", (req, res) => {
    res.send("OK");
});

// auth
app.use(prefix.AUTH, routers[0]);

// post-it

// todo

// DB 연결 및 서버 가동
const startServer = async () => {
    try {
        // DB 연결 완료될 때까지 대기
        await initDB();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

startServer();