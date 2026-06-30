const { OAuth2Client } = require("google-auth-library");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    ''
);

const userRepository = require("../Repository/userRepository");
const postRepository = require("../Repository/postRepository");

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

            /**
             * 최초 회원가입 시에 당일의 post-it 을 자동생성하는 로직.
             * 관리자(is_admin=1)는 post-it을 생성하지 않음.
             */
            if (user.is_admin !== 1) {
                await postRepository.create(user.id);
            }
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
    },

    async getMe(userId) {
        const user = await userRepository.findById(userId);

        return user;
    }
};

module.exports = authService;
