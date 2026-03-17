const mongoose=require("mongoose");
const validator=require("validator");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["rider", "driver"],
      default: "rider",
    },
    savedPlaces: [
      {
        name: String,
        address: String,
        lat: Number,
        lng: Number,
      },
    ],

    rating: {
      type: Number,
      default: 5,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Make strong password");
        }
      },
    },
  },
  { timestamps: true },
);
module.exports=mongoose.model("user",UserSchema)