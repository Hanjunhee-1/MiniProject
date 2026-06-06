const { OAuth2Client } = require("google-auth-library");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    ''
);

const userRepository = require("../Repository/userRepository");

const authService = {
    async googleLogin(idToken) {
        // Google token 검증

        const ticket = await client.verifyIdToken({
            idToken,
            audience:
                process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const { email, name } = payload;

        // 가입된 사용자인지 확인
        let user = await userRepository.findByEmail(email);

        // 가입이 되어있지 않다면 자동으로 회원가입
        if (!user) {
            user = await userRepository.create(name, email);
        }

        const token = jwt.sign(
            user.toJson(),
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return {
            token
        };
    }
};

module.exports = authService;
