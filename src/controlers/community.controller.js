const Utils = require("../utils/utils");
const constant = require("../utils/constant");
const CommunityService = require("../services/community.service");
const getfeedPost = async (req, res) => {
  try {
    const serviceResponse = await CommunityService?.getFeedPostServices();
    Utils?.responseFormat(
      res,
      serviceResponse?.code,
      serviceResponse?.message,
      serviceResponse?.data,
    );
  } catch (error) {
    console.log("Error in getfeedPost:", error);
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const createfeedPost = async (req, res) => {
  try {
    const response = await CommunityService?.createfeedPost(req.user, req.body);
    Utils?.responseFormat(
      res,
      response?.code,
      response?.message,
      response?.data,
    );
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const updatePost = async (req, res) => {
  try {
    const response = await CommunityService?.updatePost(req.user, req.body);
    Utils?.responseFormat(res, response?.code, response?.message);
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const deletePost = async (req, res) => {
  try {
    const response = await CommunityService?.deletePost(req.user, req.body);
    Utils?.responseFormat(res, response?.code, response?.message);
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};
module.exports = { getfeedPost, createfeedPost, updatePost, deletePost };
