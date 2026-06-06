require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prefix = require("./Utils/prefix");

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

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});