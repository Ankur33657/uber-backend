const CaptainServices = require("../services/captain.service");
const { responseFormat } = require("../utils/utils");
const { ResponseCode } = require("../utils/constant");
const jwt = require("jsonwebtoken");
const loginCaptain = async (req, res) => {
  try {
    const captain = await CaptainServices?.loginService(req.body);
    const captainToken = jwt.sign(
      { _id: captain?.data?._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE },
    );
    res.cookie("captainToken", captainToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    responseFormat(res, captain?.code, captain?.message, captain?.data);
  } catch (error) {
    responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

const signUpCaptain = async (req, res) => {
  try {
    const user = await CaptainServices.signUpService(req.user, req.body);
    const captainToken = jwt.sign(
      { _id: user?.data?.user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE },
    );
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("captainToken", captainToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    responseFormat(res, user?.code, user?.message, user?.data);
  } catch (error) {
    responseFormat(
      res,
      error.code || ResponseCode.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const getProfile = async (req, res) => {
  try {
    return responseFormat(
      res,
      ResponseCode?.OK,
      "Profile fetch successfully",
      req.captain,
    );
  } catch (error) {
    responseFormat(
      res,
      error?.code || ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    const captain = await CaptainServices?.updateProfile(req.captain, req.body);
    return responseFormat(res, captain?.code, captain?.message, captain?.data);
  } catch (error) {
    responseFormat(
      res,
      error?.code || ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const deleteCaptain = async (req, res) => {
  try {
    const user = await CaptainServices?.deleteProfile(req.captain);
    res.clearCookie("captainToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return responseFormat(res, user?.code, user?.message, user?.data);
  } catch (error) {
    responseFormat(
      res,
      error?.code || ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const getCaptainStatus = async (req, res) => {
  try {
    const cap = await CaptainServices?.getCaptainStatus(req.captain);
    return responseFormat(res, cap?.code, cap?.message, cap?.data);
  } catch (error) {
    responseFormat(
      res,
      error?.code || ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};



module.exports = {
  loginCaptain,
  signUpCaptain,
  getProfile,
  updateProfile,
  deleteCaptain,
  getCaptainStatus,
};
