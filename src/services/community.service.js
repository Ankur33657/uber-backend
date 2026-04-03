const { CurrencyCodes } = require("validator/lib/isISO4217");
const Community = require("../models/community.model");
const constant = require("../utils/constant");
const CommonService = require("./common.service");
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

const createfeedPost = async (currentUser, data) => {
  const { message, tags, mediaUrl, mediaKey, mediaType } = data;
  if (!message)
    return {
      code: constant?.ResponseCode?.BAD_REQUEST,
      message: "Missing payload",
      data: null,
    };
  const newPost = new Community({
    user: currentUser?._id,
    data: {
      message: message,
      mediaUrl: mediaUrl,
      mediaKey: mediaKey,
      mediaType: mediaType,
      tags: tags,
    },
  });
  newPost.save();
  if (newPost)
    return {
      code: constant?.ResponseCode?.CREATED,
      message: "post created sucessfully",
      data: newPost,
    };
};

const updatePost = async (currentUser, data) => {
  const { _id, like, comment } = data;

  const post = await Community.findById(_id);
  if (!post) {
    throw new Error("Post not found");
  }
  let updatedPost;
  let message = "";
  if (like) {
    const userId = currentUser._id.toString();
    const isLiked = post.like.some((id) => id.toString() === userId);
    if (isLiked) {
      updatedPost = await Community.findByIdAndUpdate(
        _id,
        { $pull: { like: currentUser._id } },
        { new: true },
      );
      message = "Unliked successfully";
    } else {
      updatedPost = await Community.findByIdAndUpdate(
        _id,
        { $addToSet: { like: currentUser._id } },
        { new: true },
      );
      message = "Liked successfully";
    }
  } else {
    updatedPost = await Community.findByIdAndUpdate(
      _id,
      {
        $push: {
          comments: {
            commentBy: currentUser?._id,
            message: comment,
          },
        },
      },
      { new: true },
    );
    message = "Comment added successfully";
  }

  return {
    code: constant?.ResponseCode?.OK,
    message,
    data: updatedPost,
  };
};

const deletePost = async (currentUser, data) => {
  const { _id, key } = data;
  const post = await Community.findById(_id);
  if (!post)
    return {
      code: constant?.ResponseCode?.BAD_REQUEST,
      message: "Post not found",
      data: null,
    };
  if (post?.user.toString() != currentUser?._id.toString()) {
    return {
      code: constant?.ResponseCode?.UNAUTHORIZED,
      message: "Unauthorized to delete this post",
      data: null,
    };
  }
  if (key) await CommonService?.deleteImage(key);
  await Community.findByIdAndDelete(_id);
  return {
    code: constant?.ResponseCode?.OK,
    message: "Post deleted Successfully ",
    data: null,
  };
};

module.exports = {
  getFeedPostServices,
  createfeedPost,
  updatePost,
  deletePost,
};
