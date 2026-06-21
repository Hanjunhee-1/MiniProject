const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'JWT 토큰이 없습니다'
        });
    }

    // Authorization: Bearer eyJhbGci... 에서 JWT 부분만 추출
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(403).json({
            message: '유효하지 않은 토큰'
        })
    }
}

module.exports = { authMiddleware };