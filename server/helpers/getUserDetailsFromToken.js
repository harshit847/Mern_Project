const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    console.log("🛠 Received Token:", token);  // 👈 Check token mil raha hai ya nahi

    if (!token || typeof token !== 'string') {
        console.log("❌ Token missing or invalid type");
        return { message: "Session expired", logout: true };
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("✅ Decoded Token:", decoded);  // 👈 Yeh dekho token valid hai ya nahi

        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            console.log("❌ User not found in database!");
            return { message: "User not found", logout: true };
        }

        return user;
    } catch (error) {
        console.error("❌ JWT Error:", error.name, "-", error.message);  // 👈 Yeh dekho kya issue aa raha hai

        if (error.name === 'TokenExpiredError') {
            return { message: "Token expired, please login again", logout: true };
        }

        if (error.name === 'JsonWebTokenError') {
            return { message: "Invalid token", logout: true };
        }

        return { message: "Authentication error", logout: true };
    }
};

module.exports = getUserDetailsFromToken;
