const User = require("../models/user.model");
const { ResponseCode } = require("../utils/constant");
const bcrypt = require("bcryptjs");
const login = async (data) => {
  const { email, password } = data;
  if (!email || !password)
    throw { code: ResponseCode.BAD_REQUEST, message: "Missing parameters" };
  const emailLower = email.trim().toLowerCase();
  const isPresent = await User.findOne({ email: emailLower }).select(
    "+password",
  );
  if (!isPresent)
    throw { code: ResponseCode.UNAUTHORIZED, message: "Invailid Credintial" };
  const isCorrectPassword = await bcrypt.compare(password, isPresent.password);
  if (!isCorrectPassword)
    throw { code: ResponseCode.UNAUTHORIZED, message: "Invalid Credentials" };

  return {
    code: ResponseCode.OK,
    data: isPresent,
    message: "Login Successful",
  };
};

const signup = async (data) => {
  const { name, email, password } = data;
  const emailLower = email.trim().toLowerCase();
  const isPresent = await User.findOne({
    email: emailLower,
  });
  if (isPresent)
    throw { code: ResponseCode.ALREADY_EXIST, message: "Email already exists" };
  const hashPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name: name,
    email: emailLower,
    password: hashPassword,
  });
  await newUser.save();
  if (newUser) {
    return {
      code: ResponseCode.CREATED,
      data: newUser,
      message: "user Created Successfully",
    };
  }
};

const updateProfile = async (currentUser, data) => {
  const { name, savedPlaces } = data;
  const user = await User.findByIdAndUpdate(
    currentUser?._id,
    { name: name, savedPlaces: savedPlaces },
    { new: true, runValidators: true },
  );
  return {
    code: ResponseCode.OK,
    data: user,
    message: "Profile updated Successfully",
  };
};


module.exports = { login, signup, updateProfile };
