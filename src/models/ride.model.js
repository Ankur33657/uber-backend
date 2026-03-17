const mongoose = require("mongoose");
const RideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
      required: true,
    },
    src: {
      name: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    destination: {
      name: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
      default: "requested",
    },

    duration: {
      type: Number, // in minutes
    },

    distance: {
      type: Number, // in km
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports=mongoose.model("ride", RideSchema);