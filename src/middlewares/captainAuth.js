const Utils = require("../utils/utils");
const constant = require("../utils/constant");
const Captain=require("../models/captain.model")
const jwt=require("jsonwebtoken")
const CaptainAuth = async (req, res, next) => {
    try {
        const { captainToken } = req.cookies;
        if (!captainToken) Utils?.responseFormat(res, constant?.ResponseCode.UNAUTHORIZED, "Unauthorized Captain");
        const decord = jwt.verify(captainToken, process.env.JWT_SECRET);
        const captain = await Captain.findOne({ _id: decord._id });
        if (!captain) Utils?.responseFormat(res, constant?.ResponseCode?.UNAUTHORIZED, "UnAuthorized Captain");
        req.captain = captain;
        next();

    } catch (error) {
        Utils?.responseFormat(res,error.code || constant?.ResponseCode.INTERNAL_SERVER_ERROR,error?.message)
    }
}

module.exports = {CaptainAuth};