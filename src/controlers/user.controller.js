const express = require("express");
const userServices=require("../services/user.service")
const { ResponseCode } = require("../utils/constant")
const { responseFormat } = require("../utils/utils")
const jwt = require("jsonwebtoken")
const loginUser = async(req,res) => {
    try {
        const user = await userServices.login(req.body);
        const token = jwt.sign({ _id: user.data._id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
        res.cookie("token", token);
        const { password, ...safeUser } = user.data.toObject();
        return responseFormat(res, user.code, user.message, safeUser);
    } 
    catch (error) {
       return responseFormat(res,error.code || ResponseCode.INTERNAL_SERVER_ERROR,error.message)
    }
}

const signUpUser = async (req, res) => {
    try {  
        const user = await userServices.signup(req.body);
        const token = jwt.sign({ _id: user.data._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRE,
        });
        res.cookie("token", token);
        const { password, ...safeUser } = user.data.toObject();
        return responseFormat(res, user.code, user.message, safeUser);
    } catch (error) {
        return responseFormat(res, error.code || ResponseCode.INTERNAL_SERVER_ERROR, error.message);
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", null);
        return responseFormat(res,ResponseCode.OK,"Logout Successful")
    } catch (error) {
        return responseFormat(res, error.code || ResponseCode.INTERNAL_SERVER_ERROR, error.message);
    }
}

const UserProfile = async (req, res) => {
    try {
        return responseFormat(res,ResponseCode.OK,"User profile fetch successfully",req.user);
    } catch (error) {
        return responseFormat(res, error.code || ResponseCode.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = { loginUser, signUpUser, logoutUser, UserProfile }; 