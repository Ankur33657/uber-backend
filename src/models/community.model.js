const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    like: {
      type: [String],
      default: [],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

const CommunitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      message: { type: String },
      mediaUrl: { type: String },
      mediaType: { type: String },
      mediaKey: { type: String },
      tags:{type:[String]}

    },
    like: {
      type: [String],
      default: [],
    },
    comments: [CommentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("community", CommunitySchema);
