const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    // Check if token is present and is a valid string
    if (!token || typeof token !== 'string') {
        return {
            message: "Session expired",
            logout: true
        };
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return { message: "User not found", logout: true };
        }

        return user;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                message: "Token expired, please login again",
                logout: true
            };
        }

        if (error.name === 'JsonWebTokenError') {
            return {
                message: "Invalid token",
                logout: true
            };
        }

        return {
            message: "Authentication error",
            logout: true
        };
    }
};

module.exports = getUserDetailsFromToken;
