const mongoose = require("mongoose");
const StoryScheme = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      url: { type: String },
      key: { type: String },
      type: { type: String },
    },
    text: {
      type: String,
    },
    caption: String,
    expiresAt: {
      type: Date,
      required: true,
    },
    deletedAt: {
      type: Date,
      require: true,
    },
    view: [
      {
        name: {
          type: String,
        },
        imageUrl: {
          type: String,
          default: "",
        },
        seenAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true },
);
StoryScheme.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("story", StoryScheme);
