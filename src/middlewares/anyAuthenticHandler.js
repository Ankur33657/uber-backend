// src/middlewares/anyAuthenticHandler.js

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Captain = require("../models/captain.model");
const { responseFormat } = require("../utils/utils");
const { ResponseCode } = require("../utils/constant");

const Auth = async (req, res, next) => {
  try {
    const { token, captainToken } = req.cookies;

    if (!token && !captainToken) {
      return responseFormat(
        res,
        ResponseCode.UNAUTHORIZED,
        "Unauthorized: No token provided",
      );
    }
    if (token && captainToken) {
      return responseFormat(
        res,
        ResponseCode.BAD_REQUEST,
        "Invalid state: Both tokens present",
      );
    }

    const decoded = token
      ? jwt.verify(token, process.env.JWT_SECRET)
      : jwt.verify(captainToken, process.env.JWT_SECRET);

    const user = token
      ? await User.findOne({ _id: decoded._id })
      : await Captain.findOne({ _id: decoded._id });

    if (!user) {
      return responseFormat(
        res,
        ResponseCode.UNAUTHORIZED,
        "Unauthorized: User/Captain not found",
      );
    }

    req.user = {
      ...(user.toObject ? user.toObject() : user),
      role: token ? "user" : "captain",
    };

    next();
  } catch (error) {
    return responseFormat(
      res,
      ResponseCode.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

module.exports = { Auth };
