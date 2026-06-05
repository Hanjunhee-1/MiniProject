const express = require("express");

const router = express.Router();

const prefix = require("../Utils/prefix");

router.get("/", (req, res) => {
    res.send(`현재 ${prefix.AUTH} 에 있습니다.`);
})

module.exports = router;