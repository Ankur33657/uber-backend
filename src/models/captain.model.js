const mongoose = require("mongoose");

const CaptainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      unique: true,
    },
    vehicle: {
      insurance: {
        key: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      license: {
        key: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      make: { type: String, required: true },
      model: { type: String, required: true },
      vehicleNumber: { type: String, required: true },
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
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
      required: true,
    },
    AdharNumber: {
      type: String,
      required: true,
      match: [/^\d{12}$/, "Invalid Aadhaar number"],
    },
    earningGoal: {
      type: Number,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"],
    },
    photo: {
      key: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    desc: { type: String, required: true },
  },
  { timestamps: true },
);
CaptainSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("captain", CaptainSchema);
