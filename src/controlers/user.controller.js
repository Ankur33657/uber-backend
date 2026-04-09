const express = require("express");
const userServices = require("../services/user.service");
const { ResponseCode } = require("../utils/constant");
const { responseFormat } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const loginUser = async (req, res) => {
  try {
    const user = await userServices.login(req.body);
    const token = jwt.sign({ _id: user.data._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const { password, ...safeUser } = user.data.toObject();
    return responseFormat(res, user.code, user.message, safeUser);
  } catch (error) {
    return responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

const signUpUser = async (req, res) => {
  try {
    const user = await userServices.signup(req.body);
    const token = jwt.sign({ _id: user.data._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const { password, ...safeUser } = user.data.toObject();
    return responseFormat(res, user.code, user.message, safeUser);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return responseFormat(
        res,
        ResponseCode.BAD_REQUEST,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      );
    }
    return responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong",
    );
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return responseFormat(res, ResponseCode.OK, "Logout Successful");
  } catch (error) {
    return responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

const UserProfile = async (req, res) => {
  try {
    return responseFormat(
      res,
      ResponseCode.OK,
      "User profile fetch successfully",
      req.user,
    );
  } catch (error) {
    return responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userServices.updateProfile(req.user, req.body);
    return responseFormat(res, user?.code, user?.message, user?.data);
  } catch (error) {
    return responseFormat(
      res,
      error?.code || ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

module.exports = {
  loginUser,
  signUpUser,
  logoutUser,
  UserProfile,
  updateProfile,
};
