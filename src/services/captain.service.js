const Captain = require("../models/captain.model");
const User = require("../models/user.model");
const { ResponseCode } = require("../utils/constant");
const bcrypt = require("bcryptjs");
const loginService = async (data) => {
  const { email, password } = data;
  if (!email || !password)
    throw { code: ResponseCode.BAD_REQUEST, message: "Missing Parameters!!" };
  const emailLower = email.trim().toLowerCase();
  const user = await User.findOne({
    email: emailLower,
  }).select("+password");
  if (!user)
    throw { code: ResponseCode.UNAUTHORIZED, message: "Invalid Credentials" };
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword || user?.role !== "captain")
    throw { code: ResponseCode.UNAUTHORIZED, message: "Invalid Credentials" };
  
  const captain = await Captain.findOne({ user: user._id });
  if (!captain)
    throw {
      code: ResponseCode.NOT_FOUND,
      message: "Captain profile not found",
    };

  return {
    code: ResponseCode.OK,
    message: "Login Successful",
    data: user,
    captain,
  };
};

const signUpService = async (currentUser, data) => {
  // adding some background Checkup later for now only update the role of User.
  const {
    AdharNumber,
    earningGoal,
    make,
    model,
    name,
    panNumber,
    phone,
    vehicleNumber,
    VehicleInsurance,
    drivingLicene,
    photo,
    desc,
  } = data;
  if (
    !AdharNumber ||
    !earningGoal ||
    !make ||
    !model ||
    !name ||
    !panNumber ||
    !phone ||
    !vehicleNumber ||
    !VehicleInsurance?.key ||
    !drivingLicene?.key ||
    !photo?.key ||
    !desc
  )
    throw { code: ResponseCode.BAD_REQUEST, message: "Missing Parameters" };
  const existingProfile = await Captain.findOne({ user: currentUser?._id });
  if (existingProfile)
    throw {
      code: ResponseCode.ALREADY_EXIST,
      message: "Captain profile already exists",
    };
  const user = await User.findById(currentUser?._id);
  if (!user) {
    throw { code: ResponseCode.UNAUTHORIZED, message: "User does not exist" };
  }

  user.phone = phone;
  user.name = name;
  user.role = "captain";
  await user.save();

  const newCaptain = new Captain({
    user: currentUser?._id,
    vehicle: {
      insurance: { key: VehicleInsurance?.key, url: VehicleInsurance?.url },
      license: { key: drivingLicene?.key, url: drivingLicene?.url },
      make: make,
      model: model,
      vehicleNumber: vehicleNumber,
    },
    AdharNumber: AdharNumber,
    earningGoal: earningGoal,
    panNumber: panNumber,
    photo: { key: photo?.key, url: photo?.url },
    desc: desc,
  });
  await newCaptain.save();
  return {
    code: ResponseCode.CREATED,
    message: "Captain Created Suceessful",
    data: newCaptain,
  };
};

const updateProfile = async (currentCaptain, data) => {
  const { online, busy } = data;
  
  const updateData = {};
  if (typeof online === "boolean") updateData.isOnline = online;
  if (typeof busy === "boolean") updateData.isBusy = busy;

  if (Object.keys(updateData).length === 0) {
    throw {
      code: ResponseCode.BAD_REQUEST,
      message: "No valid fields provided",
    };
  }

  const captain = await Captain.findByIdAndUpdate(
    currentCaptain?._id,
    { $set: updateData },
    { new: true },
  ).select("isOnline isBusy");

  return {
    code: ResponseCode.OK,
    message: "Updated Successfully",
    data: captain,
  };
};;

const deleteProfile = async (currentCaptain) => {
  const captain = await Captain?.deleteOne({ _id: currentCaptain?._id });
  const user = await User.findByIdAndUpdate(
    currentCaptain?.user,
    { role: "rider" },
    { new: true, runValidators: true },
  );
  return { code: ResponseCode?.OK, message: "Profile deleted", data: user };
};


const getCaptainStatus = async (currentCaptain) => {
  const captain = await Captain.findById(currentCaptain?._id).select(
    "isOnline isBusy status earningGoal",
  );
  if (captain) {
    return {
      code: ResponseCode?.OK,
      message: "status get successfully",
      data: captain,
    };
  } else {
    throw {
      code: ResponseCode?.INTERNAL_SERVER_ERROR,
      message: "Error in getting status",
    };
  }
};




module.exports = {
  loginService,
  signUpService,
  updateProfile,
  deleteProfile,
  getCaptainStatus,
};