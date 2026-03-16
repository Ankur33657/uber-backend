const Captain = require("../models/captain.model");
const User = require("../models/user.model");
const {ResponseCode} = require("../utils/constant");
const bcrypt = require("bcryptjs");
const loginService=async (data) => {
    const { email, password } = data;
    if (!email || !password) throw { code: ResponseCode.BAD_REQUEST, message:"Missing Parameters!!"};
    const user = await User.findOne({
        email: email
    }).select("+password");
    if (!user) throw { code: ResponseCode.UNAUTHORIZED, message: "Invailid Credintials" };
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword || user?.role !== "driver") throw { code: ResponseCode.UNAUTHORIZED, message: "Invaild Credentials" };
    return {code:ResponseCode.OK,message:"Login Successful",data:user}

}

const signUpService = async (currentUser,data) => {
    // adding some background Checkup later for now only update the role of User.
    const { model, number, color } = data;
    if(!model || !number || !color)throw{code:ResponseCode.BAD_REQUEST,message:"Missing Parameters"}
    const existingProfile = await Captain.findOne({ user: currentUser?._id });
    if (existingProfile)
      throw {
        code: ResponseCode.ALREADY_EXIST,
        message: "Captain profile already exists",
        };
    const user = User.findByIdAndUpdate(
      id,
      { role: "driver" },
      { new: true, runValidators: true },
    );
    const newCaptain = new Captain({
        user: id,
        vehicle:{model:model,number:number,color:color}
    })
    await newCaptain.save();
    return { code: ResponseCode.CREATED, message: "Captain Created Suceessful", data: newCaptain };

}

const updateProfile = async (currentCaptain, data) => {
  if (!data?.vehicle) {
    throw { code: ResponseCode.BAD_REQUEST, message: "Vehicle data required" };
  }

  const { model, number, color } = data.vehicle;

  if (!model || !number || !color) {
    throw { code: ResponseCode.BAD_REQUEST, message: "Missing Parameters" };
  }
  if (
    currentCaptain.vehicle.model === model &&
    currentCaptain.vehicle.number === number &&
    currentCaptain.vehicle.color === color
  ) {
    throw {
      code: ResponseCode.NOT_MODIFIED,
      message: "No changes made (Data is identical)",
    };
  }

  const captain = await Captain.findByIdAndUpdate(
    currentCaptain._id,
    {
      $set: {
        "vehicle.model": model,
        "vehicle.number": number,
        "vehicle.color": color,
      },
    },
    { new: true, runValidators: true },
  );

  return {
    code: ResponseCode.OK,
    message: "Profile updated Successfully",
    data: captain,
      };
   
};

module.exports = { loginService, signUpService, updateProfile };