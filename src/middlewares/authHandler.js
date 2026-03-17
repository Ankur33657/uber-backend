const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
const {responseFormat} = require("../utils/utils")
const {ResponseCode}=require("../utils/constant")
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return responseFormat(res, ResponseCode.UNAUTHORIZED, "Unauthorized user: No token provided");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            return responseFormat(res, ResponseCode.UNAUTHORIZED, "Unauthorized user: User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        return responseFormat(res, ResponseCode.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports={userAuth}