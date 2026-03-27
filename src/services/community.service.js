const Community = require("../models/community.model");
const constant = require("../utils/constant");
const getFeedPostServices = async () => {
  const posts = await Community.find()
    .populate("user", "name profileImage")
    .populate("comments.commentBy", "name profileImage")
    .sort({ createdAt: -1 });
  return {
    code: constant?.ResponseCode?.OK,
    message: "fetch all post",
    data: posts,
  };
};

const createfeedPost = async (currentUser,data) => {
  const { message, tags, mediaUrl, mediaKey,mediaType } = data;
  if (!message) return { code: constant?.ResponseCode?.BAD_REQUEST, message: "Missing payload", data: null };
  const newPost = new Community({
    user: currentUser?._id,
    data: {
      message: message,
      mediaUrl: mediaUrl,
      mediaKey: mediaKey,
      mediaType: mediaType,
      tags:tags
    }
    
  })
  newPost.save();
  if(newPost)return {code:constant?.ResponseCode?.CREATED,message:"post created sucessfully",data:newPost}
}

module.exports = { getFeedPostServices, createfeedPost };
