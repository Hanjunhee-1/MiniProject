const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 일단 test
app.use("/", (req, res) => {
    res.send("OK");
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});