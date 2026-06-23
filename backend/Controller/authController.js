const authService = require("../Service/authService");

const authController = {
    async googleLogin(req, res) {
        try {
            const { token } = await authService.googleLogin(req.body.token);

            res.status(200).json({
                success: true,
                token
            });
        } catch (error) {
            console.error("Error during google login:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    async getMe(req, res) {
        try {
            const { id: userId } = req.user;
            console.log(userId);
            console.log(req.user);
            const user = await authService.getMe(userId);
            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            console.error("Error during getMe:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = authController;