const mongoose = require("mongoose");

const CaptainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    vehicle: {
      model: { type: String, required: true },
      number: { type: String, required: true },
      color: { type: String, required: true },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isBusy: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 5,
    },
    earning: {
      today: Number,
      total: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("captain", CaptainSchema);
