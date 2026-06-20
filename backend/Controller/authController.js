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
    }
};

module.exports = authController;